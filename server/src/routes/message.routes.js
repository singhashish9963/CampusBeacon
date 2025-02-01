import { Router } from "express";
import {
  createMessage,
  getMessagesByChannel,
  deleteMessage,
} from "../controllers/message.controller.js";


const router = Router();


router.post("/create-message", createMessage);


router.get("/get-channel-message/:channelId", getMessagesByChannel);



router.delete("/delete-message/:id", deleteMessage);

export default router;
