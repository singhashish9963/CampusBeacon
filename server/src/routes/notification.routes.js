import express from "express";
import {
  getUserNotifications,
  getNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
} from "../controllers/notification.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all routes.
router.use(authMiddleware);

// Get all notifications for the logged in user (with pagination).
router.get("/", getUserNotifications);

// Get a single notification by ID.
router.get("/:id", getNotification);

// Get count of unread notifications.
router.get("/unread/count", getUnreadNotificationCount);

// Create a new notification (supports file uploads).
router.post("/", createNotification);

// Update an existing notification.
router.put("/:id", updateNotification);

// Delete a notification.
router.delete("/:id", deleteNotification);

// Mark a single notification as read.
router.put("/:id/read", markNotificationAsRead);

// Mark all notifications as read.
router.put("/read-all", markAllNotificationsAsRead);

export default router;
