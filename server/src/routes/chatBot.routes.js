import { Router } from "express";
import {
  addQuestionAnswer,
  askQuestion,
  getAllQuestions,
  trainModel,
} from "../controllers/chatbot.controller.js";

const router = Router();

router.post("/ask", askQuestion);
router.post("/add", addQuestionAnswer);
router.get("/questions", getAllQuestions);
router.post("/train", trainModel);

export default router;
