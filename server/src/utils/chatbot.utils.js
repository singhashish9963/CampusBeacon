// nlp/languageProcessor.js
import { NlpManager } from "node-nlp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Mutex } from "async-mutex"; // Import Mutex
import config from "../config/chatbot.js";

// --- Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_FILE = config.modelPath;
const CORPUS_FILE = config.corpusPath;
const fileMutex = new Mutex(); // Create a Mutex for file operations

// Ensure the directory for the model exists
const modelDir = path.dirname(MODEL_FILE);
if (!fs.existsSync(modelDir)) {
  fs.mkdirSync(modelDir, { recursive: true });
}
// Ensure the directory for the corpus exists
const corpusDir = path.dirname(CORPUS_FILE);
if (!fs.existsSync(corpusDir)) {
  fs.mkdirSync(corpusDir, { recursive: true });
}

// --- Confidence Levels --- (from config)
const HIGH_CONFIDENCE = config.confidenceLevels.HIGH;
const MEDIUM_CONFIDENCE = config.confidenceLevels.MEDIUM;
const LOW_CONFIDENCE = config.confidenceLevels.LOW;
const SUGGESTION_THRESHOLD = config.confidenceLevels.SUGGESTION;

// --- NLP Manager Initialization ---
const manager = new NlpManager({
  languages: config.nlpConfig.languages || ["en"],
  forceNER: true,
  nlu: { log: config.nlpConfig.log },
  modelFileName: MODEL_FILE, // Used by manager internally if needed, but we manage load/save
  threshold: config.nlpConfig.threshold, // Set manager's base threshold
  autoSave: false, // Explicit saving
  autoLoad: false, // Explicit loading
  // Consider enabling 'useNeural' based on performance needs and environment setup
  // useNeural: true,
});

class AdvancedLanguageProcessor {
  constructor() {
    this.corpus = null; // Loaded asynchronously
    this.contextMemory = new Map(); // Session-based context
    this.entityPatterns = this.initializeEntityPatterns();
    this.synonyms = this.initializeSynonyms();
    this.sentimentCache = new Map(); // Cache sentiment analysis results
    this.phraseVectorsCache = new Map(); // Cache computed phrase vectors
    this.isModelTrained = false; // Track if model is trained in current session
  }

  // --- Initialization ---
  async initialize() {
    this.corpus = await this.loadCorpus(); // Load corpus first
    await this.loadOrTrainModel(); // Then load or train the model
  }

  async loadCorpus() {
    console.log(`Attempting to load corpus from: ${CORPUS_FILE}`);
    try {
      if (!fs.existsSync(CORPUS_FILE)) {
        console.warn(
          `Corpus file not found at ${CORPUS_FILE}. Creating with default data.`
        );
        const defaultCorpus = this.getDefaultCorpus();
        await fs.promises.writeFile(
          CORPUS_FILE,
          JSON.stringify(defaultCorpus, null, 2),
          "utf8"
        );
        return defaultCorpus;
      }

      const corpusData = await fs.promises.readFile(CORPUS_FILE, "utf8");
      const corpus = JSON.parse(corpusData);

      // Basic validation and cleanup
      if (!corpus || !Array.isArray(corpus.phrases)) {
        console.warn(
          `Corpus file at ${CORPUS_FILE} is invalid. Using default corpus.`
        );
        return this.getDefaultCorpus();
      }

      corpus.phrases = corpus.phrases
        .filter(
          (phrase) =>
            phrase &&
            phrase.question &&
            typeof phrase.question === "string" && // Ensure question is string
            phrase.answer &&
            typeof phrase.answer === "string" && // Ensure answer is string
            phrase.category
        )
        .map((phrase) => ({
          ...phrase,
          // Store lowercase version for matching, keep original for display/use
          lowercaseQuestion: phrase.question.toLowerCase(),
        }));

      console.log(
        `Corpus loaded successfully with ${corpus.phrases.length} phrases.`
      );
      return corpus;
    } catch (error) {
      console.error("Error loading corpus file:", error);
      console.warn("Using default corpus due to error.");
      return this.getDefaultCorpus();
    }
  }

  getDefaultCorpus() {
    // Provides a basic corpus if the file is missing or invalid
    // (Keep your extensive default list here as in the original)
    return {
        phrases: [
          {
            question: "hello",
            answer:
              "Hello there! Welcome to CampusBeacon. It's great to have you here. How can I assist you today?",
            category: "greetings",
          },
          {
            question: "hi",
            answer:
              "Hi! Glad you're here at CampusBeacon. How can I help you with our services?",
            category: "greetings",
          },
          {
            question: "hey",
            answer:
              "Hey! Thanks for stopping by CampusBeacon. Let me know what you're looking for!",
            category: "greetings",
          },
          {
            question: "good morning",
            answer:
              "Good morning! Hope you have a wonderful day on CampusBeacon!",
            category: "greetings",
          },
          {
            question: "good evening",
            answer:
              "Good evening! Feel free to explore CampusBeacon's features anytime.",
            category: "greetings",
          },
          {
            question: "how are you",
            answer:
              "I'm here to help! Thanks for asking. What can I do for you today on CampusBeacon?",
            category: "casual",
          },
          {
            question: "What is CampusBeacon?",
            answer:
              "CampusBeacon is a comprehensive platform that connects campus communities with events, academic resources, forums, and more. We strive to make campus life easier and more engaging.",
            category: "general",
          },
          {
            question: "How do I sign up for CampusBeacon?",
            answer:
              "Signing up is quick and easy! Just click on 'Register' on our homepage, enter your email and password, and you're all set.",
            category: "registration",
          },
          {
            question: "What services does CampusBeacon offer?",
            answer:
              "We offer real-time event updates, lost and found, buy and sell boards, academic collaboration tools, forums, and more. Check our site for a full list of features!",
            category: "services",
          },
          {
            question: "How can I contact CampusBeacon support?",
            answer:
              "For support, visit our 'Contact Us' page or send an email to campusbeacon0@gmail.com. We'll get back to you soon!",
            category: "support",
          },
          {
            question: "Is my personal data safe on CampusBeacon?",
            answer:
              "Yes, we employ industry-standard security measures to keep your data safe. Please see our Privacy Policy for more details.",
            category: "privacy",
          },
          {
            question: "What campus events are coming up?",
            answer:
              "Check out the dynamic events calendar on CampusBeacon to see what's happening. You can also filter by categories or dates.",
            category: "events",
          },
          {
            question: "How do I find events on CampusBeacon?",
            answer:
              "Just head to our 'Events' section. You can browse upcoming events by date, category, or campus location.",
            category: "events",
          },
          {
            question: "I need help",
            answer:
              "Let me know what you need help with specifically, and I'll do my best to assist!",
            category: "help",
          },
          {
            question: "How can I access the hostel section?",
            answer:
              "You can access the hostel section by clicking on the 'Hostel' button in the navbar. There, you can check hostel details, officials, and other features.",
            category: "hostel",
          },
          {
            question: "How can I submit a complaint about hostel issues?",
            answer:
              "To submit a complaint, go to the hostel section and find the 'Complaint Box'. You can enter your issue, and the hostel administration will review it.",
            category: "hostel",
          },
          {
            question: "Where can I see hostel notifications?",
            answer:
              "You can check hostel-related notifications in the 'Notification Box' inside the hostel section. Admins post important updates there.",
            category: "notification",
          },
          {
            question: "How can I view hostel officials?",
            answer:
              "You can find the list of hostel officials in the 'Hostel Officials' section. It includes details like their name, position, and contact info.",
            category: "officials",
          },
          {
            question: "How can I check my attendance?",
            answer:
              "Your attendance records are available in the 'Attendance' section. It shows your subject-wise attendance percentage.",
            category: "attendance",
          },
          {
            question: "How can I access study materials?",
            answer:
              "You can find study materials, PDFs, and images categorized by branches and semesters in the 'Resource Hub' section.",
            category: "resource_hub",
          },
          {
            question: "How can I buy an item from another student?",
            answer:
              "Go to the 'Buy & Sell' section to browse items listed by other students. You can contact the seller and negotiate the price.",
            category: "buy_sell",
          },
          {
            question: "How can I sell my items to other students?",
            answer:
              "In the 'Buy & Sell' section, click on 'Sell an Item' and upload details about the product, including images, description, and price.",
            category: "buy_sell",
          },
          {
            question: "Where can I check the menu of canteens?",
            answer:
              "You can check the menu of different canteens in the 'Eateries' section. It shows the available food items and their prices.",
            category: "eateries",
          },
          {
            question: "Can I rate the food in canteens?",
            answer:
              "Yes, you can rate and review the food in the 'Eateries' section to help other students choose the best options.",
            category: "eateries",
          },
          {
            question: "How can I take a ride?",
            answer:
              "To take a ride, go to the 'Rides' section and check available rides. You can book a ride based on your destination and time preference.",
            category: "rides",
          },
          {
            question: "How can I share a ride?",
            answer:
              "If you want to share a ride, go to the 'Rides' section and list your ride details, including start location, destination, and available seats.",
            category: "rides",
          },
          {
            question: "How can I view upcoming exams?",
            answer:
              "You can check upcoming exams in the 'Exam Schedule' section, where dates and subjects are listed.",
            category: "resource_hub",
          },
          {
            question: "Can I view my class timetable?",
            answer:
              "Yes, your class timetable is available in the 'Timetable' section under Resource Hub.",
            category: "resource_hub",
          },
          {
            question: "How do I find past year question papers?",
            answer:
              "Past year question papers are available in the 'Resource Hub' under the study materials section.",
            category: "resource_hub",
          },
          {
            question: "How do I contact hostel officials?",
            answer:
              "Hostel officials' contact details are listed in the 'Hostel Officials' section.",
            category: "officials",
          },
          {
            question: "Can I request maintenance for my hostel room?",
            answer:
              "Yes, you can request maintenance by submitting a complaint in the 'Complaint Box' under the hostel section.",
            category: "hostel",
          },
          {
            question: "How do I book a ride to the railway station?",
            answer:
              "You can check for available rides in the 'Rides' section and book one that suits your schedule.",
            category: "rides",
          },
          {
            question: "Can I list multiple items for sale?",
            answer:
              "Yes, you can list multiple items in the 'Buy & Sell' section.",
            category: "buy_sell",
          },
          {
            question:
              "How do I know if my attendance is below the required percentage?",
            answer:
              "You will see a warning in the 'Attendance' section if your attendance is below the minimum percentage required.",
            category: "attendance",
          },
          {
            question: "Where can I download assignment PDFs?",
            answer:
              "You can download assignment PDFs from the 'Resource Hub' under your branch and semester.",
            category: "resource_hub",
          },
          {
            question:
              "Can I search for specific food items in the eateries section?",
            answer:
              "Yes, you can search for specific food items and their availability in the 'Eateries' section.",
            category: "eateries",
          },
          {
            question: "How do I report a lost or found item?",
            answer:
              "You can report lost and found items in the 'Lost & Found' section.",
            category: "lost_found",
          },
          {
            question: "Is there a way to check hostel mess timings?",
            answer:
              "Yes, you can check hostel mess timings in the 'Hostel' section.",
            category: "hostel",
          },
          {
            question: "Can I update my profile details?",
            answer:
              "Yes, you can edit your profile details in the 'Profile' section.",
            category: "general",
          },
          {
            question: "How do I view my exam results?",
            answer:
              "Your exam results are available in the 'Exam Results' section of the Resource Hub.",
            category: "resource_hub",
          },
        ].map((p) => ({ ...p, lowercaseQuestion: p.question.toLowerCase() })), // Ensure defaults also have lowercase
    };
  }

  async loadOrTrainModel() {
    try {
      if (fs.existsSync(MODEL_FILE)) {
        console.log(`Loading existing model from: ${MODEL_FILE}`);
        await manager.load(MODEL_FILE);
        console.log("Model loaded successfully.");
        this.isModelTrained = true;
      } else {
        console.log("Model file not found. Training a new model...");
        if (!this.corpus || this.corpus.phrases.length === 0) {
          console.error("Cannot train model: Corpus is empty or not loaded.");
          return; // Avoid training on empty data
        }
        await this.prepareTrainingData();
        await this.trainAndSaveModel(); // Train and save the new model
      }
    } catch (error) {
      console.error("Error loading or training model:", error);
      // Optionally: Fallback or further error handling
    }
  }

  // Separate function to add documents/answers to the manager
  async prepareTrainingData() {
    if (!this.corpus) {
      console.error("Cannot prepare training data: Corpus not loaded.");
      return;
    }
    console.log(
      `Preparing training data with ${this.corpus.phrases.length} phrases...`
    );
    // Clear existing documents/answers in case of retrain
    manager.settings.languages.forEach((lang) => {
      manager.nlp.sentences[lang] = [];
      manager.nlp.answers[lang] = {};
    });

    for (const phrase of this.corpus.phrases) {
      if (phrase.lowercaseQuestion && phrase.answer && phrase.category) {
        // Use lowercase question for training
        manager.addDocument("en", phrase.lowercaseQuestion, phrase.category);
        // Keep original answer casing
        manager.addAnswer("en", phrase.category, phrase.answer);

        // Add synonym variations (using lowercase)
        const words = phrase.lowercaseQuestion.split(/\W+/).filter(Boolean);
        for (const word of words) {
          const synonyms = this.findSynonyms(word); // findSynonyms should work with lowercase
          for (const synonym of synonyms) {
            // Be careful not to replace parts of other words
            const regex = new RegExp(`\\b${word}\\b`, "gi"); // Use word boundary
            if (phrase.lowercaseQuestion.match(regex)) {
              const synonymQuestion = phrase.lowercaseQuestion.replace(
                regex,
                synonym
              );
              // Avoid adding identical questions multiple times if synonyms overlap heavily
              if (synonymQuestion !== phrase.lowercaseQuestion) {
                manager.addDocument("en", synonymQuestion, phrase.category);
                // console.log(`Added synonym variation: ${synonymQuestion}`);
              }
            }
          }
        }
      }
    }
    console.log("Training data prepared.");
  }

  // --- Core NLP Logic ---

  // Helper to get cached or compute vector (operates on lowercase)
  getCachedVector(text) {
    const lowerText = text.toLowerCase();
    if (!this.phraseVectorsCache.has(lowerText)) {
      this.phraseVectorsCache.set(
        lowerText,
        this.generateWordVector(lowerText)
      );
    }
    return this.phraseVectorsCache.get(lowerText);
  }

  // TF-based Vectorization (operates on lowercase text)
  // Consider TF-IDF or embeddings for future improvement
  generateWordVector(text) {
    if (!text || typeof text !== "string") return new Map();
    // Already expect lowercase text here
    const stopWords = new Set([
      "the",
      "and",
      "is",
      "in",
      "to",
      "a",
      "of",
      "for",
      "on",
      "with",
      "i",
      "you",
      "me",
      "my",
      "what",
      "how",
      "where",
      "when",
      "can",
      "do",
    ]);
    const words = text
      .split(/\W+/)
      .filter((w) => w && w.length > 1 && !stopWords.has(w));
    const vector = new Map();
    let sumSq = 0;

    for (const word of words) {
      const count = (vector.get(word) || 0) + 1;
      vector.set(word, count);
    }

    // Normalize vector (L2 norm)
    for (const count of vector.values()) {
      sumSq += count * count;
    }
    const magnitude = Math.sqrt(sumSq);

    if (magnitude > 0) {
      for (const [word, count] of vector.entries()) {
        vector.set(word, count / magnitude);
      }
    }
    return vector;
  }

  // Cosine Similarity (operates on TF vectors)
  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.size === 0 || vecB.size === 0) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const [word, valueA] of vecA.entries()) {
      dotProduct += valueA * (vecB.get(word) || 0);
      normA += valueA * valueA;
    }
    for (const valueB of vecB.values()) {
      normB += valueB * valueB;
    }

    const magnitudeA = Math.sqrt(normA);
    const magnitudeB = Math.sqrt(normB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Finds potential matches using cosine similarity (compares lowercase input to lowercase corpus questions)
  findContextualMatches(lowerCaseQuestion, threshold) {
    if (!lowerCaseQuestion || !this.corpus || !this.corpus.phrases) {
      return [];
    }
    const questionVector = this.getCachedVector(lowerCaseQuestion); // Use cache/compute for input
    const matches = [];

    for (const phrase of this.corpus.phrases) {
      if (!phrase.lowercaseQuestion || !phrase.answer) continue;

      // Get vector for the corpus phrase (use cache/compute)
      const phraseVector = this.getCachedVector(phrase.lowercaseQuestion);
      const similarity = this.cosineSimilarity(questionVector, phraseVector);

      if (similarity >= threshold) {
        matches.push({
          question: phrase.question, // Return original case question
          answer: phrase.answer, // Return original case answer
          category: phrase.category,
          similarity,
          lowercaseQuestion: phrase.lowercaseQuestion, // Include for filtering
        });
      }
    }
    return matches.sort((a, b) => b.similarity - a.similarity);
  }

  // Context Analysis (operates on lowercase)
  enhancedContextAnalysis(lowerCaseQuestion, sessionId) {
    const context = this.contextMemory.get(sessionId) || [];
    const currentQuestionVector = this.getCachedVector(lowerCaseQuestion);
    const recentQuestions = context.slice(-3); // Look at last 3 context questions

    // Generate weighted vectors for recent context questions (expect context items are already lowercase)
    const contextVectors = recentQuestions.map((q, index) => ({
      vector: this.getCachedVector(q),
      weight: (0.6 * (index + 1)) / recentQuestions.length, // Recent get slightly more weight (total context weight 0.6)
    }));

    let bestMatch = null;
    let bestSimilarityScore = 0;

    if (!this.corpus || !this.corpus.phrases) {
      return { bestMatch: null, bestSimilarityScore: 0 };
    }

    for (const phrase of this.corpus.phrases) {
      if (!phrase.lowercaseQuestion || !phrase.answer) continue;

      const phraseVector = this.getCachedVector(phrase.lowercaseQuestion);

      // Similarity with current question (weighted 0.4)
      const currentSimilarity =
        this.cosineSimilarity(currentQuestionVector, phraseVector) * 0.4;

      // Combined similarity with context questions (total weight 0.6)
      let contextSimilarity = 0;
      for (const { vector, weight } of contextVectors) {
        if (vector.size > 0) {
          // Only calculate if context vector is valid
          contextSimilarity +=
            this.cosineSimilarity(vector, phraseVector) * weight;
        }
      }

      const totalSimilarity = currentSimilarity + contextSimilarity;

      if (totalSimilarity > bestSimilarityScore) {
        bestSimilarityScore = totalSimilarity;
        bestMatch = phrase; // Keep the whole phrase object
      }
    }

    // Return original case question/answer
    return {
      bestMatch: bestMatch
        ? {
            ...bestMatch,
            question: bestMatch.question,
            answer: bestMatch.answer,
          }
        : null,
      bestSimilarityScore,
    };
  }

  updateContext(sessionId, lowerCaseQuestion) {
    if (!sessionId || !lowerCaseQuestion) return;
    const context = this.contextMemory.get(sessionId) || [];
    context.push(lowerCaseQuestion); // Store lowercase in context memory
    if (context.length > 5) context.shift(); // Limit context size
    this.contextMemory.set(sessionId, context);
  }

  // Keyword extraction (operates on lowercase)
  extractKeywords(lowerCaseText) {
    if (!lowerCaseText || typeof lowerCaseText !== "string") return [];
    const stopWords = new Set([
      "the",
      "and",
      "is",
      "in",
      "to",
      "a",
      "of",
      "for",
      "on",
      "with",
      "i",
      "you",
      "me",
      "my",
      "what",
      "how",
      "where",
      "when",
      "can",
      "do",
      "what",
      "is",
      "help",
      "need",
      "want",
    ]);
    const words = lowerCaseText
      .split(/\W+/)
      .filter((w) => w && w.length > 2 && !stopWords.has(w));
    const wordFreq = new Map();
    words.forEach((word) => wordFreq.set(word, (wordFreq.get(word) || 0) + 1));

    const keywords = Array.from(wordFreq.entries())
      .filter(([_, freq]) => freq > 0) // Keep all significant words for now
      .sort(([, freqA], [, freqB]) => freqB - freqA)
      .slice(0, 5) // Limit to top 5
      .map(([word]) => word);
    return keywords;
  }

  // Regex-based Entity Extraction (operates on original case text for better matching of proper nouns, etc.)
  extractEntitiesRegex(text) {
    if (!text || typeof text !== "string") return {};
    const entities = {};
    for (const [type, pattern] of Object.entries(this.entityPatterns)) {
      // Use matchAll to find all occurrences
      const matches = [...text.matchAll(pattern)];
      if (matches.length > 0) {
        // Store potentially multiple values per type
        entities[type] = matches.map((match) => match[0]);
      }
    }
    return entities;
  }

  // Synonym lookup (operates on lowercase)
  findSynonyms(word) {
    if (!word || typeof word !== "string") return [];
    const lowerWord = word.toLowerCase();
    for (const [key, synonymsList] of this.synonyms.entries()) {
      if (key === lowerWord || synonymsList.includes(lowerWord)) {
        // Return the list including the key, excluding the input word itself
        return [key, ...synonymsList].filter((syn) => syn !== lowerWord);
      }
    }
    return [];
  }

  // --- Data Management ---

  // Adds a QnA pair, saves corpus, adds to manager IN MEMORY. Does NOT train.
  async addQnAPair(question, answer, category = "general") {
    if (
      !question ||
      !answer ||
      typeof question !== "string" ||
      typeof answer !== "string"
    ) {
      throw new Error("Invalid question or answer format");
    }
    if (!this.corpus) {
      throw new Error("Corpus not loaded. Cannot add QnA pair.");
    }

    const release = await fileMutex.acquire(); // Acquire lock before reading/writing file
    try {
      console.log("Acquired lock to add QnA pair.");
      // Reload corpus from file inside the lock to get the latest version
      let currentCorpusData;
      let currentCorpus;
      try {
        currentCorpusData = await fs.promises.readFile(CORPUS_FILE, "utf8");
        currentCorpus = JSON.parse(currentCorpusData);
        if (!currentCorpus || !Array.isArray(currentCorpus.phrases)) {
          console.warn(
            "Corpus file content was invalid during add. Starting fresh."
          );
          currentCorpus = { phrases: [] };
        }
      } catch (readError) {
        console.warn(
          "Could not read existing corpus during add, might be creating new. Error:",
          readError.code
        );
        currentCorpus = { phrases: [] }; // Start with empty if file doesnt exist or unreadable
      }

      const lowerCaseQuestion = question.toLowerCase();

      // Avoid adding exact duplicates (check lowercase question)
      const exists = currentCorpus.phrases.some(
        (p) => p.lowercaseQuestion === lowerCaseQuestion
      );
      if (exists) {
        console.log(`Question already exists: "${question}". Skipping add.`);
        return false; // Indicate that nothing was added
      }

      // Add to the structure read from file
      const newPhrase = { question, answer, category, lowercaseQuestion };
      currentCorpus.phrases.push(newPhrase);

      // Write the updated structure back to the file
      await fs.promises.writeFile(
        CORPUS_FILE,
        JSON.stringify(currentCorpus, null, 2),
        "utf8"
      );
      console.log("Corpus file updated successfully.");

      // Update in-memory corpus as well
      this.corpus.phrases.push(newPhrase);

      // Add to the NLP manager (in memory only)
      manager.addDocument(
        "en",
        newPhrase.lowercaseQuestion,
        newPhrase.category
      );
      manager.addAnswer("en", newPhrase.category, newPhrase.answer);
      console.log("QnA pair added to in-memory manager.");

      // Invalidate vector cache for the added phrase if needed (safer to clear all or relevant ones)
      this.phraseVectorsCache.delete(newPhrase.lowercaseQuestion);

      // *** CRITICAL: Do NOT train here. Training should be explicit. ***

      return true; // Indicate successful addition
    } catch (error) {
      console.error("Error adding QnA pair:", error);
      return false;
    } finally {
      release(); // Always release the lock
      console.log("Released lock after adding QnA pair.");
    }
  }

  // --- Model Training ---
  // Explicit function to train and save the model
  async trainAndSaveModel() {
    try {
      console.log("Starting model training...");
      if (!this.corpus || this.corpus.phrases.length === 0) {
        console.warn(
          "Attempted to train model, but corpus is empty. Aborting training."
        );
        return false;
      }
      // Ensure latest data from corpus is prepared in the manager
      await this.prepareTrainingData(); // This function adds documents/answers

      const hrstart = process.hrtime();
      await manager.train();
      const hrend = process.hrtime(hrstart);
      console.info(
        `Model training completed in ${hrend[0]}s ${hrend[1] / 1000000}ms`
      );

      console.log("Saving model...");
      await manager.save(MODEL_FILE, true); // Force saving even if unchanged according to manager
      console.log(`Model saved successfully to ${MODEL_FILE}`);
      this.isModelTrained = true; // Mark as trained
      this.phraseVectorsCache.clear(); // Clear vector cache after retrain as model changes context
      return true;
    } catch (error) {
      console.error("Error training and saving model:", error);
      this.isModelTrained = false;
      return false;
    }
  }

  // --- Helper Methods (Internal) ---

  initializeEntityPatterns() {
    // Using slightly more robust regex, note capturing groups may differ
    return {
      date: /\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)\b/gi,
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi,
      phone: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/gi, // Improved phone regex
      time: /\b(?:1[0-2]|0?[1-9])(?::[0-5][0-9])?(?::[0-5][0-9])?\s*(?:am|pm)\b/gi,
      url: /https?:\/\/[^\s]+/gi,
      courseCode: /\b[A-Z]{2,4}\s?\d{3,4}\b/gi, // Matches "CS 101", "ECE450"
      buildingName:
        /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(Hall|Building|Center|Library)\b/gi, // Matches "Smith Hall", "Engineering Building"
      professorName:
        /\b(?:Prof\.?|Dr\.?|Professor|Doctor)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/gi, // Matches "Prof. Smith", "Dr Jones"
    };
  }

  initializeSynonyms() {
    // Ensure keys and values are lowercase for consistent lookup
    return new Map([
      [
        "hello",
        ["hi", "hey", "greetings", "howdy", "good morning", "good evening"],
      ],
      ["help", ["assist", "support", "aid", "guide", "assistance"]],
      [
        "event",
        ["activity", "program", "gathering", "meeting", "session", "workshop"],
      ],
      ["register", ["signup", "enroll", "join", "subscribe"]],
      ["cancel", ["delete", "remove", "unsubscribe", "quit", "stop"]],
      ["campus", ["university", "college", "school", "institution"]],
      ["forum", ["discussion", "board", "community", "thread"]],
      ["resource", ["material", "tool", "document", "file", "pdf", "link"]],
      ["hostel", ["dorm", "residence", "dormitory", "hall"]],
      ["sell", ["list", "offer"]],
      ["buy", ["purchase", "acquire", "get"]],
      ["ride", ["lift", "transport", "carpool", "share"]],
    ]);
  }
}

// --- Singleton Instance and Initialization ---
const processor = new AdvancedLanguageProcessor();

// Initialize the processor (load corpus, load/train model) asynchronously
// This promise can be awaited elsewhere if needed before handling requests
const initializationPromise = processor.initialize();

initializationPromise
  .then(() => {
    console.log("AdvancedLanguageProcessor initialized.");
  })
  .catch((error) => {
    console.error("Failed to initialize AdvancedLanguageProcessor:", error);
    // Consider exiting the application if initialization fails critically
    // process.exit(1);
  });

// --- Public Interface ---

export const processQuestion = async (question, sessionId = "default") => {
  await initializationPromise; // Ensure initialization is complete

  if (!processor.isModelTrained && !processor.corpus?.phrases?.length) {
    console.error(
      "Cannot process question: Model not trained and corpus is empty."
    );
    return {
      /* Default error response */
    };
  }

  try {
    if (!question || typeof question !== "string" || question.trim() === "") {
      return {
        answer: "Please provide a valid question.",
        category: "error",
        confidence: 0,
        similarQuestions: [],
        entities: {},
        sentiment: "neutral",
        keywords: [],
      };
    }

    const originalQuestion = question; // Keep original for logging or context if needed
    const lowerCaseQuestion = question.toLowerCase();

    // Update context with lowercase version
    processor.updateContext(sessionId, lowerCaseQuestion);

    // Process with NlpManager (expects lowercase)
    const result = await manager.process("en", lowerCaseQuestion);
    const nlpConfidence = result.score || 0;
    const nlpAnswer = result.answer;
    const nlpIntent = result.intent || "None";

    // Extract features (use lowercase for analysis, original for regex)
    const keywords = processor.extractKeywords(lowerCaseQuestion);
    const regexEntities = processor.extractEntitiesRegex(originalQuestion); // Use original case text for regex
    const nlpEntities = result.entities || []; // From NlpManager NER

    // Combine entities (simple merge, prioritize NLP Manager's usually)
    const combinedEntities = { ...regexEntities };
    nlpEntities.forEach((entity) => {
      if (entity.entity && entity.sourceText) {
        if (!combinedEntities[entity.entity]) {
          combinedEntities[entity.entity] = [];
        }
        // Avoid duplicates if regex caught the same thing
        if (!combinedEntities[entity.entity].includes(entity.sourceText)) {
          combinedEntities[entity.entity].push(entity.sourceText);
        }
      }
    });

    // Use NLP Manager's sentiment if available and scored, otherwise fallback (could add custom here if needed)
    const sentimentResult =
      result.sentiment && result.sentiment.score !== 0
        ? { score: result.sentiment.score, sentiment: result.sentiment.vote }
        : { score: 0, sentiment: "neutral" }; // Basic default fallback

    // --- Decision Logic ---

    // 1. High Confidence NLP Match
    if (nlpAnswer && nlpIntent !== "None" && nlpConfidence >= HIGH_CONFIDENCE) {
      console.log(
        `High confidence match (${nlpConfidence}) via NLP Manager for intent: ${nlpIntent}`
      );
      const similar = processor
        .findContextualMatches(lowerCaseQuestion, SUGGESTION_THRESHOLD)
        .filter((q) => q.lowercaseQuestion !== lowerCaseQuestion) // Filter out self
        .slice(0, 3)
        .map((q) => q.question); // Return original case questions
      return {
        answer: nlpAnswer, // Use the direct answer from matched intent
        category: nlpIntent,
        confidence: nlpConfidence,
        similarQuestions: similar,
        entities: combinedEntities,
        sentiment: sentimentResult.sentiment,
        keywords,
        matchType: "nlp_high",
      };
    }

    // 2. Medium Confidence - Try Enhanced Context Analysis
    console.log(
      `NLP confidence (${nlpConfidence}) below HIGH (${HIGH_CONFIDENCE}). Trying enhanced context.`
    );
    const { bestMatch: contextMatch, bestSimilarityScore: contextScore } =
      processor.enhancedContextAnalysis(lowerCaseQuestion, sessionId);

    if (contextMatch && contextScore >= MEDIUM_CONFIDENCE) {
      console.log(
        `Medium confidence match (${contextScore}) via Enhanced Context Analysis.`
      );
      const similar = processor
        .findContextualMatches(lowerCaseQuestion, SUGGESTION_THRESHOLD)
        .filter((q) => q.lowercaseQuestion !== contextMatch.lowercaseQuestion) // Filter match
        .slice(0, 3)
        .map((q) => q.question);
      return {
        answer: contextMatch.answer, // Original case answer
        category: contextMatch.category,
        confidence: contextScore,
        similarQuestions: similar,
        entities: combinedEntities,
        sentiment: sentimentResult.sentiment,
        keywords,
        matchType: "context_medium",
      };
    }

    // 3. Low Confidence - Try Direct Cosine Similarity Fallback
    console.log(
      `Context confidence (${contextScore}) below MEDIUM (${MEDIUM_CONFIDENCE}). Trying direct similarity.`
    );
    const directMatches = processor.findContextualMatches(
      lowerCaseQuestion,
      LOW_CONFIDENCE
    );

    if (directMatches.length > 0) {
      const bestDirectMatch = directMatches[0];
      console.log(
        `Low confidence match (${bestDirectMatch.similarity}) via Direct Similarity.`
      );
      const similar = directMatches.slice(1, 4).map((q) => q.question); // Suggest next best direct matches
      return {
        answer: bestDirectMatch.answer, // Original case answer
        category: bestDirectMatch.category,
        confidence: bestDirectMatch.similarity,
        similarQuestions: similar,
        entities: combinedEntities,
        sentiment: sentimentResult.sentiment,
        keywords,
        matchType: "similarity_low",
      };
    }

    // 4. No Match Found - Provide Default + Suggestions
    console.log(`No matches found above LOW threshold (${LOW_CONFIDENCE}).`);
    const suggestions = processor
      .findContextualMatches(lowerCaseQuestion, SUGGESTION_THRESHOLD)
      .slice(0, 3)
      .map((q) => q.question); // Original case questions
    return {
      answer:
        "I'm not sure how to answer that. Can you try rephrasing? You might also find these related topics helpful:",
      category: "unknown",
      confidence: 0,
      similarQuestions: suggestions,
      entities: combinedEntities,
      sentiment: sentimentResult.sentiment,
      keywords,
      matchType: "none",
    };
  } catch (error) {
    console.error("Error processing question:", error);
    return {
      answer:
        "Sorry, I encountered an internal error trying to process your request. Please try again later.",
      category: "error",
      confidence: 0,
      similarQuestions: [],
      entities: {},
      sentiment: "neutral",
      keywords: [],
      matchType: "error",
    };
  }
};

// Expose the explicit training function
export const trainAndSave = async () => {
  await initializationPromise; // Ensure processor is initialized
  return await processor.trainAndSaveModel();
};

// Expose the add function
export const addQnAPair = async (question, answer, category) => {
  await initializationPromise; // Ensure processor is initialized
  // The function inside the processor now handles the mutex and saving corpus
  const success = await processor.addQnAPair(question, answer, category);
  if (success) {
    console.log(
      "Successfully added QnA. Remember to call trainAndSave() later to include it in the active model."
    );
  }
  return success;
};

// Optionally expose the processor instance if direct access is needed elsewhere (use with caution)
// export { processor };
