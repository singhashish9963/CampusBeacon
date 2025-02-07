import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {
  addQnAPair,
  processQuestion,
  getAllQnAPairs,
  getQnAPairsByCategory,
  trainAndSave,
} from "../utils/chatbot.utils.js";

export const addQuestionAnswer = asyncHandler(async (req, res) => {
  const { question, answer, category } = req.body;
  if (!question || !answer) {
    throw new ApiError(400, "Question and answer are required");
  }
  const intent = await addQnAPair(question, answer, category);
  res
    .status(201)
    .json(new ApiResponse(201, { intent }, "Q&A pair added successfully"));
});

export const askQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;
  if (!question) {
    throw new ApiError(400, "Question is required");
  }
  const response = await processQuestion(question);
  res.status(200).json(new ApiResponse(200, response, "Response generated"));
});

export const getAllQuestions = asyncHandler(async (req, res) => {
  const qnaPairs = getAllQnAPairs();
  res
    .status(200)
    .json(
      new ApiResponse(200, qnaPairs, "All Q&A pairs retrieved successfully")
    );
});

export const getQuestionsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  if (!category) {
    throw new ApiError(400, "Category is required");
  }
  const qnaPairs = getQnAPairsByCategory(category);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        qnaPairs,
        `Q&A pairs for category '${category}' retrieved successfully`
      )
    );
});

export const trainModel = asyncHandler(async (req, res) => {
  await trainAndSave();
  res
    .status(200)
    .json(new ApiResponse(200, {}, "NLP model trained successfully"));
});
