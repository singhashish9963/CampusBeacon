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

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.use(authMiddleware);

router.get("/unread/count", getUnreadNotificationCount);

router.post("/broadcast", upload.single("file"), broadcastNotification);

router.put("/read-all", markAllNotificationsAsRead);
router.put("/:id/read", markNotificationAsRead);

router.get("/", getUserNotifications);
router.post("/", upload.single("file"), createNotification);

router.get("/:id", getNotification);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
