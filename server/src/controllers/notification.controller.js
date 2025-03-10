import Notification from "../models/notification.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  extractCloudinaryPublicId,
} from "../utils/cloudinary.js";

/**
 * Retrieve all notifications for the authenticated user with pagination.
 */
export const getUserNotifications = asyncHandler(async (req, res) => {
  console.log("getUserNotifications: Entered");
  console.log("getUserNotifications: req.user:", req.user);
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

    console.log("getUserNotifications: Notifications fetched:", notifications);
    res.status(200).json({
      success: true,
      data: notifications,
      message: "User notifications retrieved successfully",
    });
  } catch (error) {
    console.error("getUserNotifications: Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications",
      error: error.message,
    });
  }
});

/**
 * Retrieve a single notification by ID.
 */
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

/**
 * Create a new notification.
 * If a file is provided via req.file, it will be uploaded to Cloudinary.
 */
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
      console.log("Successfully uploaded file to Cloudinary:", file_url);
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
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

/**
 * Update an existing notification.
 */
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

    // Update notification properties
    notification.message = message || notification.message;
    notification.type = type || notification.type;
    notification.entityType = entityType || notification.entityType;
    notification.entityId = entityId || notification.entityId;
    notification.actionUrl = actionUrl || notification.actionUrl;
    notification.metadata = metadata || notification.metadata;

    if (typeof is_read === "boolean") {
      notification.is_read = is_read;
      notification.read_at = is_read ? new Date() : null; // Set read_at only if is_read is true
    }

    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
      message: "Notification updated successfully",
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update notification",
      error: error.message,
    });
  }
});

/**
 * Delete a notification.
 */
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
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
});

/**
 * Mark a single notification as read.
 */
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
    console.error("Error marking notification as read:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
});

/**
 * Mark all notifications as read for the authenticated user.
 */
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    await Notification.update(
      { is_read: true, read_at: new Date() },
      { where: { userId, is_read: false } }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
});

/**
 * Retrieve the count of unread notifications for the authenticated user.
 */
export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  console.log("getUnreadNotificationCount: Entered");
  console.log("getUnreadNotificationCount: req.user:", req.user);
  const userId = req.user.id;

  try {
    const unreadCount = await Notification.count({
      where: { userId, is_read: false },
    });

    console.log("getUnreadNotificationCount: Unread count:", unreadCount);
    res.status(200).json({
      success: true,
      data: { unreadCount },
      message: "Unread notifications count retrieved successfully",
    });
  } catch (error) {
    console.error(
      "getUnreadNotificationCount: Error getting unread count:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "Failed to get unread notifications count",
      error: error.message,
    });
  }
});
