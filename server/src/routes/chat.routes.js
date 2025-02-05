import express from "express";
import {
  getChannels,
  getMessages,
  createMessage,
  deleteMessage,
  editMessage,
} from "../controllers/chat.controller.js";
import authMiddlware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddlware);

router.get("/channels", getChannels);
router.get("/channels/:channelId/messages", getMessages);
router.post("/channels/:channelId/messages", createMessage);
router.delete("/messages/:messageId", deleteMessage);
router.patch("/messages/:messageId", editMessage);

export default router;