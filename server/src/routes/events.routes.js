import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import filterInputMiddleware from "../middlewares/filter.middleware.js";


import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/events.controller.js";

const router = express.Router();


// Event routes
router.post(
  "/events",
  authMiddleware,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  filterInputMiddleware,
  createEvent
);
router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.put(
  "/events/:id",
  authMiddleware,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  filterInputMiddleware,
  updateEvent
);
router.delete("/events/:id", authMiddleware, deleteEvent);

export default router;
