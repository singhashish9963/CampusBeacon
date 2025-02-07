import NlpManager from "node-nlp";
import fs from "fs/promises";
import path from "path";
import config from "../config/chatbot.js";
import asyncHandler from "./asyncHandler.js";

class NlpService {
  constructor() {
    this.manager = new NlpManager(config.nlpConfig);
    this.modelPath = path.join(__dirname, "..", config.modelPath);
    this.qnaStore = new Map();
  }

  initialize = asyncHandler(async () => {
    console.log("Initializing NLP Service...");

    const modelExists = await this.checkModelExists();
    if (modelExists) {
      await this.loadModel();
    } else {
      await this.createInitialModel();
    }

    console.log("NLP Service initialized successfully");
  });

  checkModelExists = asyncHandler(async () => {
    try {
      await fs.access(this.modelPath);
      return true;
    } catch (error) {
      return false; 
    }
  });

  loadModel = asyncHandler(async () => {
    console.log("Loading existing model...");
    await this.manager.load(this.modelPath);
    console.log("Model loaded successfully");
  });

  createInitialModel = asyncHandler(async () => {
    console.log("Creating initial model...");

    const initialData = [
      {
        question: "What is this chatbot?",
        answer:
          "I am a chatbot created by CampusBeacon developers to assist in easy access to CampusBeacon",
        category: "general",
      },
      {
        question: "How can I ask a question?",
        answer:
          "Simply type your question in the chat box and I'll try my best to answer it.",
        category: "usage",
      },
      {
        question: "Can you learn new answers?",
        answer:
          "Yes, I can learn from new questions and answers that users provide to improve my knowledge.",
        category: "functionality",
      },
    ];

    for (const item of initialData) {
      await this.addQnAPair(item.question, item.answer, item.category);
    }

    await this.trainAndSave();
    console.log("Initial model created successfully");
  });


}


export default NlpService;
