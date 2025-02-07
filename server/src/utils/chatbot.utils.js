import { NlpManager } from "node-nlp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import asyncHandler from "./asyncHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelPath = path.join(__dirname, "../models/qna-model.nlp");

const manager = new NlpManager({
  languages: ["en"],
  threshold: 0.7,
  autoSave: false, 
  autoLoad: true,
});

const qnaStore = new Map();

export const initialize = asyncHandler(async () => {
  console.log("Initializing NLP Service...");
  if (await checkModelExists()) {
    await loadModel();
  } else {
    await createInitialModel();
  }
  console.log("NLP Service initialized successfully");
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
    {
      question: "What is this website?",
      answer: "This is a student platform.",
      category: "general",
    },
    {
      question: "How do I find lost items?",
      answer: "Check the 'Lost and Found' section.",
      category: "lost_found",
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
    return { answer: result.answer, confidence: result.score };
  }
  return {
    answer: "I couldn't find a suitable answer. Can you rephrase?",
    confidence: 0,
  };
});


export const getAllQnAPairs = asyncHandler(async () => {
  return Array.from(qnaStore.values()); // No async operation here
});

export const getQnAPairsByCategory = asyncHandler(async (category) => {
  return Array.from(qnaStore.values()).filter(
    (pair) => pair.category === category
  );
});

