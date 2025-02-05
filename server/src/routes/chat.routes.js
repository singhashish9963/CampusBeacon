import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getChannels,
  getMessages,
  createMessage,
  deleteMessage,

} from "../controllers/chat.controller.js";

const router = express.Router();


router.use(authMiddleware);


router.get("/channels", getChannels);
router.get("/channels/:channelId/messages", getMessages);
router.post("/channels/:channelId/messages", createMessage);


router.delete("/messages/:messageId", deleteMessage);


export default router;
