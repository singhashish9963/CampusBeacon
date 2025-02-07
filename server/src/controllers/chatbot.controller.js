import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import {
  processQuestion,
  addQnAPair,
  getAllQnAPairs,
  trainAndSave,
} from "../utils/chatbot.utils.js";

export const askQuestion = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question?.trim()) {
    throw new ApiError(400, "Question is required");
  }

  const result = await processQuestion(question);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Answer fetched successfully"));
});

export const addQuestionAnswer = asyncHandler(async (req, res) => {
  const { question, answer, category } = req.body;

  if (!question?.trim() || !answer?.trim()) {
    throw new ApiError(400, "Both question and answer are required");
  }

  const intent = await addQnAPair(question, answer, category);
  await trainAndSave();

  return res
    .status(201)
    .json(new ApiResponse(201, { intent }, "QnA pair added successfully"));
});

export const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await getAllQnAPairs();
  return res
    .status(200)
    .json(new ApiResponse(200, questions, "Questions fetched successfully"));
});

export const trainModel = asyncHandler(async (req, res) => {
  await trainAndSave();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Model trained successfully"));
});
