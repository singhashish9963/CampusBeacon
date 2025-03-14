import { NlpManager } from "node-nlp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_FILE = path.join(__dirname, "model.nlp");
const CORPUS_FILE = path.join(__dirname, "corpus.json");

const manager = new NlpManager({
  languages: ["en"],
  forceNER: true,
  nlu: { log: false },
  useNeural: true,
  modelFileName: MODEL_FILE,
});

class AdvancedLanguageProcessor {
  constructor() {
    this.corpus = this.loadCorpus();
    this.contextMemory = new Map();
    this.wordVectors = new Map();
    this.entityPatterns = this.initializeEntityPatterns();
    this.synonyms = this.initializeSynonyms();
    this.sentimentCache = new Map(); // Cache sentiment analysis results
  }

  loadCorpus() {
    try {
      return JSON.parse(fs.readFileSync(CORPUS_FILE, "utf8"));
    } catch (error) {
      console.warn("Corpus file not found or invalid. Using default corpus.");
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
              "For support, visit our 'Contact Us' page or send an email to support@campusbeacon.com. We'll get back to you soon!",
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
            "question": "How can I access the hostel section?",
            "answer": "You can access the hostel section by clicking on the 'Hostel' button in the navbar. There, you can check hostel details, officials, and other features.",
            "category": "hostel"
          },
          {
            "question": "How can I submit a complaint about hostel issues?",
            "answer": "To submit a complaint, go to the hostel section and find the 'Complaint Box'. You can enter your issue, and the hostel administration will review it.",
            "category": "hostel"
          },
          {
            "question": "Where can I see hostel notifications?",
            "answer": "You can check hostel-related notifications in the 'Notification Box' inside the hostel section. Admins post important updates there.",
            "category": "notification"
          },
          {
            "question": "How can I view hostel officials?",
            "answer": "You can find the list of hostel officials in the 'Hostel Officials' section. It includes details like their name, position, and contact info.",
            "category": "officials"
          },
          {
            "question": "How can I check my attendance?",
            "answer": "Your attendance records are available in the 'Attendance' section. It shows your subject-wise attendance percentage.",
            "category": "attendance"
          },
          {
            "question": "How do I check my CGPA?",
            "answer": "You can check your CGPA in the 'CGPA' section of the Resource Hub. It displays your cumulative grade performance.",
            "category": "resource_hub"
          },
          {
            "question": "How do I check my marks?",
            "answer": "You can view your marks in the 'Marks' section of the Resource Hub. It includes your scores for different subjects and exams.",
            "category": "resource_hub"
          },
          {
            "question": "How can I access study materials?",
            "answer": "You can find study materials, PDFs, and images categorized by branches and semesters in the 'Resource Hub' section.",
            "category": "resource_hub"
          },
          {
            "question": "How can I buy an item from another student?",
            "answer": "Go to the 'Buy & Sell' section to browse items listed by other students. You can contact the seller and negotiate the price.",
            "category": "buy_sell"
          },
          {
            "question": "How can I sell my items to other students?",
            "answer": "In the 'Buy & Sell' section, click on 'Sell an Item' and upload details about the product, including images, description, and price.",
            "category": "buy_sell"
          },
          {
            "question": "Where can I check the menu of canteens?",
            "answer": "You can check the menu of different canteens in the 'Eateries' section. It shows the available food items and their prices.",
            "category": "eateries"
          },
          {
            "question": "Can I rate the food in canteens?",
            "answer": "Yes, you can rate and review the food in the 'Eateries' section to help other students choose the best options.",
            "category": "eateries"
          },
          {
            "question": "How can I take a ride?",
            "answer": "To take a ride, go to the 'Rides' section and check available rides. You can book a ride based on your destination and time preference.",
            "category": "rides"
          },
          {
            "question": "How can I share a ride?",
            "answer": "If you want to share a ride, go to the 'Rides' section and list your ride details, including start location, destination, and available seats.",
            "category": "rides"
          },
          {
            "question": "How can I view upcoming exams?",
            "answer": "You can check upcoming exams in the 'Exam Schedule' section, where dates and subjects are listed.",
            "category": "resource_hub"
          },
          {
            "question": "How can I apply for hostel accommodation?",
            "answer": "You can apply for hostel accommodation through the 'Hostel' section, where the application form is available.",
            "category": "hostel"
          },
          {
            "question": "Can I view my class timetable?",
            "answer": "Yes, your class timetable is available in the 'Timetable' section under Resource Hub.",
            "category": "resource_hub"
          },
          {
            "question": "How do I find past year question papers?",
            "answer": "Past year question papers are available in the 'Resource Hub' under the study materials section.",
            "category": "resource_hub"
          },
          {
            "question": "How do I contact hostel officials?",
            "answer": "Hostel officials' contact details are listed in the 'Hostel Officials' section.",
            "category": "officials"
          },
          {
            "question": "Can I request maintenance for my hostel room?",
            "answer": "Yes, you can request maintenance by submitting a complaint in the 'Complaint Box' under the hostel section.",
            "category": "hostel"
          },
          {
            "question": "How do I book a ride to the railway station?",
            "answer": "You can check for available rides in the 'Rides' section and book one that suits your schedule.",
            "category": "rides"
          },
          {
            "question": "Can I list multiple items for sale?",
            "answer": "Yes, you can list multiple items in the 'Buy & Sell' section.",
            "category": "buy_sell"
          },
          {
            "question": "How do I know if my attendance is below the required percentage?",
            "answer": "You will see a warning in the 'Attendance' section if your attendance is below the minimum percentage required.",
            "category": "attendance"
          },
          {
            "question": "Where can I download assignment PDFs?",
            "answer": "You can download assignment PDFs from the 'Resource Hub' under your branch and semester.",
            "category": "resource_hub"
          },
          {
            "question": "Can I search for specific food items in the eateries section?",
            "answer": "Yes, you can search for specific food items and their availability in the 'Eateries' section.",
            "category": "eateries"
          },
          {
            "question": "How do I report a lost or found item?",
            "answer": "You can report lost and found items in the 'Lost & Found' section.",
            "category": "lost_found"
          },
          {
            "question": "Is there a way to check hostel mess timings?",
            "answer": "Yes, you can check hostel mess timings in the 'Hostel' section.",
            "category": "hostel"
          },
          {
            "question": "Can I update my profile details?",
            "answer": "Yes, you can edit your profile details in the 'Profile' section.",
            "category": "general"
          },
          {
            "question": "How do I view my exam results?",
            "answer": "Your exam results are available in the 'Exam Results' section of the Resource Hub.",
            "category": "resource_hub"
          },
          {
            "question": "How do I apply for a new ID card?",
            "answer": "You can apply for a new ID card through the 'ID Card Request' section.",
            "category": "general"
          }
        ],
        entities: {},
        patterns: [],
        relationships: {},
      };
    }
  }

  initializeEntityPatterns() {
    return {
      date:
        /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}(?:st|nd|rd|th)?,? \d{4}\b/i,
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
      phone: /\b\d{3}[-.)]\d{3}[-.)]\d{4}\b/,
      time: /\b(?:1[0-2]|0?[1-9])(?::[0-5][0-9])?\s*(?:am|pm)\b/i,
      url: /https?:\/\/[^\s]+/,
      // Added patterns for common campus-related entities
      courseCode: /\b[A-Z]{2,4}\s?\d{3,4}\b/, // e.g., "CS 101" or "ENG2020"
      buildingName: /\b[A-Z][a-z]+ Hall\b/, // e.g., "Main Hall", "Science Hall"
      professorName: /\b(Prof|Dr)\.\s[A-Z][a-z]+ [A-Z][a-z]+\b/, // e.g., "Prof. John Doe"
    };
  }

  initializeSynonyms() {
    return new Map([
      ["hello", ["hi", "hey", "greetings", "howdy"]],
      ["help", ["assist", "support", "aid", "guide"]],
      ["event", ["activity", "program", "gathering", "meeting", "session"]],
      ["register", ["signup", "enroll", "join", "subscribe"]],
      ["cancel", ["delete", "remove", "unsubscribe", "quit"]],
      // Added synonyms for campus-related terms
      ["campus", ["university", "college", "school"]],
      ["forum", ["discussion", "board", "community"]],
      ["resource", ["material", "tool", "document"]],
    ]);
  }

  generateWordVector(text) {
    const words = text.toLowerCase().split(/\W+/);
    const vector = new Map();
    words.forEach((word) => {
      vector.set(word, (vector.get(word) || 0) + 1);
    });
    return vector;
  }

  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (const [word, countA] of vecA) {
      const countB = vecB.get(word) || 0;
      dotProduct += countA * countB;
      normA += countA * countA;
    }

    for (const [_, countB] of vecB) {
      normB += countB * countB;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  findSynonyms(word) {
    for (const [key, synonyms] of this.synonyms) {
      if (key === word || synonyms.includes(word)) {
        return [key, ...synonyms];
      }
    }
    return [word];
  }

  extractEntities(text) {
    const entities = {};
    for (const [type, pattern] of Object.entries(this.entityPatterns)) {
      const matches = text.match(pattern);
      if (matches) {
        entities[type] = matches[0];
      }
    }
    return entities;
  }

  findContextualMatches(question, threshold = 0.6) {
    const questionVector = this.generateWordVector(question);
    const matches = [];

    for (const phrase of this.corpus.phrases) {
      const phraseVector = this.generateWordVector(phrase.question);
      const similarity = this.cosineSimilarity(questionVector, phraseVector);

      if (similarity > threshold) {
        matches.push({
          question: phrase.question,
          answer: phrase.answer,
          similarity,
        });
      }
    }

    return matches.sort((a, b) => b.similarity - a.similarity);
  }

  updateContext(sessionId, question) {
    const context = this.contextMemory.get(sessionId) || [];
    context.push(question);
    if (context.length > 5) context.shift();
    this.contextMemory.set(sessionId, context);
  }

  // Sentiment analysis function (basic)
  analyzeSentiment(text) {
    if (this.sentimentCache.has(text)) {
      return this.sentimentCache.get(text);
    }

    const positiveWords = ["good", "great", "excellent", "wonderful", "amazing", "helpful", "best", "easy"];
    const negativeWords = ["bad", "terrible", "awful", "horrible", "difficult", "worst", "hard", "broken"];

    let positiveScore = 0;
    let negativeScore = 0;

    const words = text.toLowerCase().split(/\W+/);
    words.forEach(word => {
      if (positiveWords.includes(word)) {
        positiveScore++;
      } else if (negativeWords.includes(word)) {
        negativeScore++;
      }
    });

    const score = positiveScore - negativeScore;
    let sentiment = "neutral";

    if (score > 0) {
      sentiment = "positive";
    } else if (score <0) {
      sentiment = "negative";
    }

    const result = { score, sentiment };
    this.sentimentCache.set(text, result); // Cache the result
    return result;
  }

  // Enhanced Context Analysis
  enhancedContextAnalysis(question, sessionId) {
    const context = this.contextMemory.get(sessionId) || [];
    const recentQuestions = context.slice(-3); // Consider the last 3 questions

    let combinedText = question + " " + recentQuestions.join(" ");
    const combinedVector = this.generateWordVector(combinedText);

    let bestMatch = null;
    let bestSimilarity = 0;

    for (const phrase of this.corpus.phrases) {
      const phraseVector = this.generateWordVector(phrase.question);
      const similarity = this.cosineSimilarity(combinedVector, phraseVector);

      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = phrase;
      }
    }

    return { bestMatch, bestSimilarity };
  }
}

const processor = new AdvancedLanguageProcessor();

export const processQuestion = async (question, sessionId = "default") => {
  try {
    processor.updateContext(sessionId, question);

    // Enhanced Context Analysis
    const { bestMatch, bestSimilarity } = processor.enhancedContextAnalysis(question, sessionId);

    const nlpResult = await manager.process("en", question);

    const entities = processor.extractEntities(question);
    const sentiment = processor.analyzeSentiment(question);

    const contextualMatches = processor.findContextualMatches(question);

    // Prioritize Enhanced Context Analysis
    if (bestSimilarity > 0.7) {
      return {
        answer: bestMatch.answer,
        similarQuestions: contextualMatches.slice(0, 3).map((m) => m.question),
        category: "contextual",
        confidence: bestSimilarity,
        entities,
        sentiment,
      };
    }

    if (nlpResult.score > 0.7 && nlpResult.answer) {
      return {
        answer: nlpResult.answer,
        similarQuestions: contextualMatches.slice(0, 3).map((m) => m.question),
        category: nlpResult.intent,
        confidence: nlpResult.score,
        entities,
        sentiment,
      };
    }

    if (contextualMatches.length > 0 && contextualMatches[0].similarity > 0.6) {
      return {
        answer: contextualMatches[0].answer,
        similarQuestions: contextualMatches.slice(1, 4).map((m) => m.question),
        category: "contextual",
        confidence: contextualMatches[0].similarity,
        entities,
        sentiment,
      };
    }

    return {
      answer:
        "I'm not entirely sure about that. Could you rephrase your question?",
      similarQuestions: contextualMatches.slice(0, 3).map((m) => m.question),
      category: "unknown",
      confidence: 0.3,
      entities,
      sentiment,
    };
  } catch (error) {
    console.error("Error processing question:", error);
    return {
      answer: "Sorry, I encountered an error processing your question.",
      similarQuestions: [],
      category: "error",
      confidence: 0,
      entities: {},
      sentiment: { score: 0, sentiment: "neutral" },
    };
  }
};

export const addQnAPair = async (question, answer, category = "general") => {
  try {
    processor.corpus.phrases.push({
      question,
      answer,
      category,
    });

    await fs.promises.writeFile(
      CORPUS_FILE,
      JSON.stringify(processor.corpus, null, 2)
    );

    manager.addDocument("en", question, category);
    manager.addAnswer("en", category, answer);

    return true;
  } catch (error) {
    console.error("Error adding QnA pair:", error);
    return false;
  }
};

export const trainAndSave = async () => {
  try {
    await manager.train();
    manager.save(MODEL_FILE);
    return true;
  } catch (error) {
    console.error("Error training model:", error);
    return false;
  }
};

(async () => {
  try {
    if (fs.existsSync(MODEL_FILE)) {
      await manager.load(MODEL_FILE);
    } else {
      for (const phrase of processor.corpus.phrases) {
        manager.addDocument("en", phrase.question, phrase.category);
        manager.addAnswer("en", phrase.category, phrase.answer);
      }
      await manager.train();
      manager.save(MODEL_FILE);
    }
  } catch (error) {
    console.error("Error initializing chatbot:", error);
  }
})();
