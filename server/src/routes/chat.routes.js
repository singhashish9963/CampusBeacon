import express from "express";
import {
  getChannels,
  createChannel,
  getMessages,
  getChannelMembers,
  updateChannel,
  deleteChannel,
} from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Channel routes
router.get("/channels", getChannels);
router.post("/channels", createChannel);
router.get("/channels/:channelId/messages", getMessages);
router.get("/channels/:channelId/members", getChannelMembers);
router.put("/channels/:channelId", updateChannel);
router.delete("/channels/:channelId", deleteChannel);

export default router;
