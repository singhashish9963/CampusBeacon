import express from "express";
import multer from "multer";
import {
  getUserNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  broadcastNotification,
} from "../controllers/notification.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";


// Use multer for parsing multipart/form-data (you might configure storage as needed)
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Apply authentication middleware to all routes.
router.use(authMiddleware);

// Routes for individual user notifications
router.get("/", getUserNotifications);
router.get("/:id", getNotification);
router.get("/unread/count", getUnreadNotificationCount);
router.post("/", createNotification);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);
router.put("/:id/read", markNotificationAsRead);
router.put("/read-all", markAllNotificationsAsRead);

// Broadcast a notification to all users (admins only).
// Use multer.single() to correctly capture file (if provided) and text fields.
router.post(
  "/broadcast",
  upload.single("file"),
  broadcastNotification
);

export default router;
