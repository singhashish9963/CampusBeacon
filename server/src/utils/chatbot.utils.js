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
