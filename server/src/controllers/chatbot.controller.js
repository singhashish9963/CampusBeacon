import {
  processQuestion,
  addQnAPair,
  trainAndSave,
} from "../utils/chatbot.utils.js";

const questionCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (question) => {
  return (question || "").toLowerCase().trim();
};

const getCachedResponse = (question) => {
  const key = getCacheKey(question);
  const cached = questionCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  return null;
};

const cacheResponse = (question, response) => {
  const key = getCacheKey(question);
  questionCache.set(key, {
    response,
    timestamp: Date.now(),
  });
};

export const askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    const sessionId = req.headers["x-session-id"] || "default";

    // Check if question is empty
    if (!question || question.trim() === "") {
      return res.status(400).json({
        message: "Question cannot be empty",
        error: true,
      });
    }

    const cachedResponse = getCachedResponse(question);
    if (cachedResponse) {
      return res.status(200).json({
        data: cachedResponse,
        message: "Answer fetched from cache",
        cached: true,
      });
    }

    const result = await processQuestion(question, sessionId);

    cacheResponse(question, result);

    return res.status(200).json({
      data: result,
      message: "Answer generated successfully",
      cached: false,
    });
  } catch (error) {
    next(error);
  }
};

export const addQuestionAnswer = async (req, res, next) => {
  try {
    const { question, answer, category = "general" } = req.body;

    // Validate inputs
    if (
      !question ||
      !answer ||
      question.trim() === "" ||
      answer.trim() === ""
    ) {
      return res.status(400).json({
        message: "Question and answer cannot be empty",
        error: true,
      });
    }

    const existingResponse = getCachedResponse(question);
    if (existingResponse) {
      questionCache.delete(getCacheKey(question));
    }

    const intent = await addQnAPair(question, answer, category);
    await trainAndSave();

    return res.status(201).json({
      data: { intent },
      message: "QnA pair added and model trained successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const trainModel = async (req, res, next) => {
  try {
    await trainAndSave();
    questionCache.clear();

    return res.status(200).json({
      message: "Model trained successfully",
      data: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
};

export const clearCache = async (req, res, next) => {
  try {
    questionCache.clear();
    return res.status(200).json({
      message: "Cache cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  askQuestion,
  addQuestionAnswer,
  trainModel,
  clearCache,
};
