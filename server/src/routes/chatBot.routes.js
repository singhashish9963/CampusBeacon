import { Router } from "express";
import {
  askQuestion,
  addQuestionAnswer,
  trainModel,
  clearCache, // Added clearCache export
} from "../controllers/chatbot.controller.js";
import filterInputMiddleware from "../middlewares/filter.middleware.js";

const router = Router();

// Apply filter middleware to both ask and add endpoints
router.post("/ask", filterInputMiddleware, askQuestion);
router.post("/add", filterInputMiddleware, addQuestionAnswer);
router.post("/train", trainModel);
router.post("/clear-cache", clearCache); 

export default router;
