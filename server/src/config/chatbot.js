import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables as early as possible
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  modelPath:
    process.env.MODEL_PATH || path.join(__dirname, "../models/campus-bot.nlp"),
  nlpConfig: {
    languages: ["en"],
    threshold: process.env.NLP_THRESHOLD || 0.6,
    autoSave: true,
    autoLoad: true,
    modelFileName: process.env.MODEL_FILENAME || "campus-bot.nlp",
  },
};

export default config;
