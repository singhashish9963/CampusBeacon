import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  extractCloudinaryPublicId,
} from "../utils/cloudinary.js";

export const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const notifications = await Notification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.status(200).json({
      success: true,
      data: notifications,
      message: "User notifications retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications",
      error: error.message,
    });
  }
});

export const getNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const notification = await Notification.findOne({
    where: { id, userId },
  });

  if (!notification) {
    throw new ApiError("Notification not found", 404);
  }

  res.status(200).json({
    success: true,
    data: notification,
    message: "Notification retrieved successfully",
  });
});

export const createNotification = asyncHandler(async (req, res) => {
  const { userId, message, type, entityType, entityId, actionUrl, metadata } =
    req.body;
  if (!userId || !message) {
    throw new ApiError("User ID and message are required", 400);
  }

  let file_url = null;
  if (req.file) {
    try {
      const uploadedUrl = await uploadImageToCloudinary(req.file.path);
      if (!uploadedUrl) {
        throw new ApiError("Failed to upload file", 500);
      }
      file_url = uploadedUrl;
    } catch (error) {
      throw new ApiError("Failed to upload file: " + error.message, 500);
    }
  }

  const notification = await Notification.create({
    userId,
    message,
    type: type || "general",
    entityType,
    entityId,
    actionUrl,
    metadata,
    file_url,
  });

  res.status(201).json({
    success: true,
    data: notification,
    message: "Notification created successfully",
  });
});

export const updateNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { message, type, entityType, entityId, actionUrl, metadata, is_read } =
    req.body;

  try {
    const notification = await Notification.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new ApiError("Notification not found", 404);
    }

    notification.message = message || notification.message;
    notification.type = type || notification.type;
    notification.entityType = entityType || notification.entityType;
    notification.entityId = entityId || notification.entityId;
    notification.actionUrl = actionUrl || notification.actionUrl;
    notification.metadata = metadata || notification.metadata;

    if (typeof is_read === "boolean") {
      notification.is_read = is_read;
      notification.read_at = is_read ? new Date() : null;
    }

    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
      message: "Notification updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
      error: error.message,
    });
  }
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const notification = await Notification.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new ApiError("Notification not found", 404);
    }

    await notification.destroy();

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const notification = await Notification.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new ApiError("Notification not found", 404);
    }

    notification.is_read = true;
    notification.read_at = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
      message: "Notification marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
});

export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
      console.error("[Backend MarkAll Error] User not authenticated for markAllNotificationsAsRead");
      throw new ApiError("User not authenticated", 401);
  }
  const userId = req.user.id;
  console.log(`[Backend MarkAll] Attempting for userId: ${userId}`);

  try {
    const [affectedCount] = await Notification.update(
      { is_read: true, read_at: new Date() },
      {
        where: { userId, is_read: false },
      }
    );

    console.log(`[Backend MarkAll] Success for userId: ${userId}. Affected rows: ${affectedCount}`);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });

  } catch (error) {
    console.error(`[Backend MarkAll Error] Failed for userId: ${userId}`, error);
    throw new ApiError(`Failed to mark all notifications as read: ${error.message}`, 500);
  }
});

export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    console.error("[Backend Error] User not found on request in getUnreadNotificationCount");
    throw new ApiError("User not authenticated", 401);
  }
  const userId = req.user.id;
  console.log(`[Backend] Attempting getUnreadNotificationCount for userId: ${userId}`);

  try {
    const unreadCount = await Notification.count({
      where: { userId, is_read: false },
    });
    console.log(`[Backend] Found unread count: ${unreadCount} for userId: ${userId}`);

    res.status(200).json({
      success: true,
      data: { unreadCount },
      message: "Unread notifications count retrieved successfully",
    });
  } catch (error) {
    console.error(`[Backend Error] Failed getUnreadNotificationCount for userId: ${userId}`, error);
    throw new ApiError("Failed to get unread notifications count", 500);
  }
});

export const broadcastNotification = asyncHandler(async (req, res) => {
  console.log("Broadcast Notification - req.body:", req.body);

  const { message, type, entityType, entityId, actionUrl, metadata } = req.body;
  if (!message || message.trim() === "") {
    throw new ApiError("Message is required for broadcast", 400);
  }

  let file_url = null;
  if (req.file) {
    try {
      const uploadedUrl = await uploadImageToCloudinary(req.file.path);
      if (!uploadedUrl) {
        throw new ApiError("Failed to upload file", 500);
      }
      file_url = uploadedUrl;
    } catch (error) {
      throw new ApiError("Failed to upload file: " + error.message, 500);
    }
  }

  const users = await User.findAll({ attributes: ["id"] });
  const userIds = users.map((user) => user.id);

  const notifications = await Promise.all(
    userIds.map((userId) =>
      Notification.create({
        userId,
        message,
        type: type || "general",
        entityType,
        entityId,
        actionUrl,
        metadata,
        file_url,
      })
    )
  );

  res.status(201).json({
    success: true,
    data: notifications,
    message: "Broadcast notification sent successfully to all users",
  });
});
