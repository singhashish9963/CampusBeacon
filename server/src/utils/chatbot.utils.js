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
        question: "What is CampusBeacon?",
        answer:
          "CampusBeacon is a platform designed to help college students with daily struggles, providing features like lost and found, buy and sell, hostel info, and cab sharing.",
        category: "general",
      },
      {
        question: "How does the Lost and Found feature work?",
        answer:
          "You can report lost items by adding a description and photo. If someone finds your item, they can contact you through the app.",
        category: "lost_found",
      },
      {
        question: "Can I buy and sell things on CampusBeacon?",
        answer:
          "Yes! You can list items you want to sell, and other students can browse and buy them within the college community.",
        category: "buy_sell",
      },
      {
        question: "How can I check the hostel menu?",
        answer:
          "The hostel menu is updated based on the time of day. You can check what's available in the Hostel section of the app.",
        category: "hostel",
      },
      {
        question: "How do I find cab sharing options?",
        answer:
          "CampusBeacon offers a cab-sharing feature where students can coordinate rides with others traveling in the same direction.",
        category: "cab_sharing",
      },
      {
        question: "Does CampusBeacon provide event updates?",
        answer:
          "Yes! CampusBeacon keeps you updated on college events, club activities, and announcements.",
        category: "events",
      },
      {
        question: "Can I connect with college clubs through CampusBeacon?",
        answer:
          "Absolutely! The platform provides information about various clubs, including their social media pages and websites.",
        category: "clubs",
      },
    ];

    for (const item of initialData) {
      await this.addQnAPair(item.question, item.answer, item.category);
    }

    await this.trainAndSave();
    console.log("Initial model created successfully");
  });

  addQnAPair = asyncHandler(async (question, answer, category = "general") => {
    const intent = `qna_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    this.manager.addDocument("en", question, intent);
    this.manager.addAnswer("en", intent, answer);

    this.qnaStore.set(intent, {
      question,
      answer,
      category,
      intent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return intent;
  });

  trainAndSave = asyncHandler(async () => {
    console.log("Training model...");
    await this.manager.train();
    await this.manager.save(this.modelPath);
    console.log("Model trained and saved successfully");
  });
}

export default NlpService;
