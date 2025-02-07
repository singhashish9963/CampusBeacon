import { NlpManager } from "node-nlp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import asyncHandler from "../utils/asyncHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelPath = path.join(__dirname, "../models/campus-bot.nlp");

const manager = new NlpManager({
  languages: ["en"],
  threshold: 0.7,
  autoSave: false,
  autoLoad: true,
});

const qnaStore = new Map();

export const initialize = asyncHandler(async () => {
  console.log("Initializing CampusBeacon Chatbot...");
  if (await checkModelExists()) {
    await loadModel();
  } else {
    await createInitialModel();
  }
  console.log("CampusBeacon Chatbot initialized successfully");
});

const checkModelExists = asyncHandler(async () => {
  try {
    await fs.access(modelPath);
    return true;
  } catch {
    return false;
  }
});

const loadModel = asyncHandler(async () => {
  console.log("Loading existing model...");
  await manager.load(modelPath);
  console.log("Model loaded successfully");
});

const createInitialModel = asyncHandler(async () => {
  console.log("Creating initial model...");
  const initialData = [
    // General Campus Information
    {
      question: "What is CampusBeacon?",
      answer:
        "CampusBeacon is a comprehensive student platform that connects and helps manage various aspects of campus life, including hostel management, lost & found services, marketplace, and attendance tracking.",
      category: "general",
    },
    // Hostel Related
    {
      question: "How do I submit a hostel maintenance request?",
      answer:
        "You can submit a maintenance request through the Hostel Management section. Click on 'Hostel Management' in the features section, then select 'Submit Maintenance Request'.",
      category: "hostel",
    },
    // Lost and Found
    {
      question: "How can I report a lost item?",
      answer:
        "To report a lost item, navigate to the 'Lost & Found' section, click on 'Report Lost Item', and fill out the form with details about your lost item.",
      category: "lost_found",
    },
    // Marketplace
    {
      question: "How do I list an item for sale?",
      answer:
        "To sell an item, go to the 'Buy & Sell' marketplace section, click on 'List New Item', and fill out the item details including price and description.",
      category: "marketplace",
    },
    // Attendance
    {
      question: "Where can I check my attendance?",
      answer:
        "You can check your attendance by clicking on the 'Attendance Manager' feature. It shows your attendance percentage for all subjects.",
      category: "attendance",
    },
    // Events
    {
      question: "How do I find upcoming campus events?",
      answer:
        "Check the Events section on the homepage or navigate to the Community section to see all upcoming campus events and activities.",
      category: "events",
    },
  ];

  for (const item of initialData) {
    await addQnAPair(item.question, item.answer, item.category);
  }

  await trainAndSave();
  console.log("Initial model created successfully");
});

export const addQnAPair = asyncHandler(
  async (question, answer, category = "general") => {
    const intent = `qna_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    manager.addDocument("en", question, intent);
    manager.addAnswer("en", intent, answer);
    qnaStore.set(intent, { question, answer, category, intent });
    return intent;
  }
);

export const trainAndSave = asyncHandler(async () => {
  console.log("Training model...");
  await manager.train();
  await manager.save(modelPath);
  console.log("Model trained and saved successfully");
});

export const processQuestion = asyncHandler(async (question) => {
  const result = await manager.process("en", question);
  if (result.intent && result.score > 0.7) {
    const qnaPair = qnaStore.get(result.intent);
    return {
      answer: result.answer,
      confidence: result.score,
      category: qnaPair?.category,
      similarQuestions: Array.from(qnaStore.values())
        .filter((pair) => pair.category === qnaPair?.category)
        .slice(0, 3)
        .map((pair) => pair.question),
    };
  }
  return {
    answer:
      "I'm not quite sure about that. Could you please rephrase your question? You can also check our specific sections like Hostel Management, Lost & Found, or Marketplace for more information.",
    confidence: 0,
    similarQuestions: [],
  };
});

export const getAllQnAPairs = asyncHandler(async () => {
  return Array.from(qnaStore.values());
});

export const getQnAPairsByCategory = asyncHandler(async (category) => {
  return Array.from(qnaStore.values()).filter(
    (pair) => pair.category === category
  );
});
