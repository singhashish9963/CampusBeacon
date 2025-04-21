// config/chatbot.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name relative to this config file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (if you use a .env file)
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  // Consistent path for the model relative to the project root or specified location
  modelPath:
    process.env.MODEL_PATH ||
    path.resolve(__dirname, "../models/campus-bot.nlp"), // Use resolve for absolute path
  corpusPath:
    process.env.CORPUS_PATH || path.resolve(__dirname, "../nlp/corpus.json"), // Explicit path for corpus

  nlpConfig: {
    languages: ["en"],
    // Base threshold for NlpManager, good high-confidence initial check
    threshold: parseFloat(process.env.NLP_THRESHOLD || 0.7),
    autoSave: false, // We handle saving explicitly
    autoLoad: false, // We handle loading explicitly
    // Removed modelFileName here, use modelPath consistently
    log: process.env.NODE_ENV !== "production", // Enable logging in dev
  },

  // Confidence thresholds for custom logic
  confidenceLevels: {
    HIGH: parseFloat(process.env.CONFIDENCE_HIGH || 0.7), // Align with nlpConfig.threshold or slightly lower
    MEDIUM: parseFloat(process.env.CONFIDENCE_MEDIUM || 0.55), // For context/fallback
    LOW: parseFloat(process.env.CONFIDENCE_LOW || 0.4), // Last resort direct match
    SUGGESTION: parseFloat(process.env.CONFIDENCE_SUGGESTION || 0.3), // For suggesting similar questions
  },
};

export default config;
