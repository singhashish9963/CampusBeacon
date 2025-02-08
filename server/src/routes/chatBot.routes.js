
import { Router } from "express";
import {
  askQuestion,
  addQuestionAnswer,
  trainModel,
} from "../controllers/chatbot.controller.js";

const router = Router();


router.post("/ask", askQuestion);


router.post("/add", addQuestionAnswer);


router.post("/train", trainModel);

export default router;
