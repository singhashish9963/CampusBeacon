import { Router } from "express";
import {
  addQuestionAnswer,
  askQuestion,
  getAllQuestions,
  getQuestionsByCategory,
  trainModel,
} from "../controllers/chatbot.controller.js";

const router = Router();



router.post("/add", addQuestionAnswer);
router.post("/ask", askQuestion);
router.get("/questions", getAllQuestions);
router.get("/questions/:category", getQuestionsByCategory);
router.post("/train", trainModel);

export default router;
