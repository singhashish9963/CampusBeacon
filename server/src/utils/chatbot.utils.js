import { NlpManager } from "node-nlp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import asyncHandler from "./asyncHandler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manager = new NlpManager({
  languages: ["en"],
  threshold: 0.7,
  autoSave: true,
  autoLoad: true,
});
const qnaStore = new Map();
const modelPath = path.join(__dirname, "../models/qna-model.nlp");

export const initialize = asyncHandler(async () => {
  console.log("Initializing NLP Service...");
  const modelExists = await checkModelExists();
  modelExists ? await loadModel() : await createInitialModel();
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
      answer:
        "This is a platform designed to help college students with various needs such as event updates, lost and found, buy and sell, and more.",
      category: "general",
    },
    {
      question: "How can I find lost items?",
      answer:
        "You can check the 'Lost and Found' section where users post details about lost or found items.",
      category: "lost_found",
    },
    {
      question: "How do I buy or sell items?",
      answer:
        "Navigate to the 'Buy and Sell' section to list items for sale or browse items posted by other students.",
      category: "marketplace",
    },
    {
      question: "Where can I see my attendance?",
      answer:
        "Attendance details are available in the 'Attendance Management' section, where you can select subjects and track your attendance.",
      category: "academics",
    },
    {
      question: "How can I check the hostel menu?",
      answer:
        "The 'Hostel' section provides the daily mess menu along with contact details for mess and hostel representatives.",
      category: "hostel",
    },
    {
      question: "How do I report a hostel issue?",
      answer:
        "You can file complaints in the 'Hostel' section, where contacts for hostel and mess representatives are listed.",
      category: "hostel",
    },
    {
      question: "How do I join college clubs?",
      answer:
        "The 'Resources' section includes links to various college clubs, their social media pages, and websites.",
      category: "clubs",
    },
    {
      question: "Is there a way to share cabs?",
      answer:
        "Yes! You can find cab-sharing options in the 'Cab Sharing' section to coordinate rides with fellow students.",
      category: "transportation",
    },
  ];

  for (const item of initialData)
    await addQnAPair(item.question, item.answer, item.category);
  await trainAndSave();
  console.log("Initial model created successfully");
});

export const addQnAPair = asyncHandler(
  async (question, answer, category = "general") => {
    const intent = `qna_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    manager.addDocument("en", question, intent);
    manager.addAnswer("en", intent, answer);
    qnaStore.set(intent, {
      question,
      answer,
      category,
      intent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
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
      similarQuestions: await findSimilarQuestions(question, result.intent),
    };
  }
  return {
    answer:
      "I'm not sure about that. Here are some similar questions I can help with:",
    confidence: 0,
    similarQuestions: await findSimilarQuestions(question),
  };
});

export const findSimilarQuestions = asyncHandler(
  async (question, excludeIntent = null, limit = 3) => {
    const results = [];
    for (const [intent, data] of qnaStore.entries()) {
      if (excludeIntent && intent === excludeIntent) continue;
      const similarity = await calculateSimilarity(question, data.question);
      if (similarity > 0.5) results.push({ ...data, similarity });
    }
    return results.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
  }
);

const calculateSimilarity = asyncHandler(async (text1, text2) => {
  const result1 = await manager.process("en", text1);
  const result2 = await manager.process("en", text2);
  return result1.score * result2.score;
});

export const getAllQnAPairs = () => Array.from(qnaStore.values());
export const getQnAPairsByCategory = (category) =>
  Array.from(qnaStore.values()).filter((pair) => pair.category === category);
