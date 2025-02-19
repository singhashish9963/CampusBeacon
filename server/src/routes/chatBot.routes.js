
import { Router } from "express";
import {
  askQuestion,
  addQuestionAnswer,
  trainModel,
} from "../controllers/chatbot.controller.js";
import filterInputMiddleware from "../middlewares/filter.middleware.js";

const router = Router();


router.post("/ask",filterInputMiddleware, askQuestion);


router.post("/add", addQuestionAnswer);


router.post("/train", trainModel);

export default router;
