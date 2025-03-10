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
  const userId = req.user.id;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

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
 * If a new file is uploaded, the old file is removed from Cloudinary and the new one is uploaded.
 */
export const updateNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { message, type, entityType, entityId, actionUrl, metadata, is_read } =
    req.body;

  const notification = await Notification.findOne({
    where: { id, userId },
  });
  if (!notification) {
    throw new ApiError("Notification not found", 404);
  }

  let file_url = notification.file_url;
  if (req.file) {
    // If existing file exists, remove it from Cloudinary.
    if (notification.file_url) {
      const publicId = extractCloudinaryPublicId(notification.file_url);
      if (publicId) {
        try {
          await deleteImageFromCloudinary(publicId);
          console.log(
            `Deleted old file with public_id: ${publicId} from Cloudinary`
          );
        } catch (error) {
          console.error("Error deleting old file from Cloudinary:", error);
          // Continue to upload new file despite failure to delete.
        }
      }
    }
    // Upload new file.
    try {
      const uploadedUrl = await uploadImageToCloudinary(req.file.path);
      if (!uploadedUrl) {
        throw new ApiError("Failed to upload new file", 500);
      }
      file_url = uploadedUrl;
      console.log("Successfully uploaded new file to Cloudinary:", file_url);
    } catch (error) {
      throw new ApiError("New file upload failed: " + error.message, 500);
    }
  }

  notification.message = message || notification.message;
  notification.type = type || notification.type;
  notification.entityType = entityType || notification.entityType;
  notification.entityId = entityId || notification.entityId;
  notification.actionUrl = actionUrl || notification.actionUrl;
  notification.metadata = metadata || notification.metadata;
  notification.file_url = file_url;

  if (typeof is_read === "boolean") {
    notification.is_read = is_read;
    if (is_read && !notification.read_at) {
      notification.read_at = new Date();
    }
  }

  await notification.save();

  res.status(200).json({
    success: true,
    data: notification,
    message: "Notification updated successfully",
  });
});

/**
 * Delete a notification.
 * Also removes associated file from Cloudinary if present.
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const notification = await Notification.findOne({
    where: { id, userId },
  });
  if (!notification) {
    throw new ApiError("Notification not found", 404);
  }

  if (notification.file_url) {
    const publicId = extractCloudinaryPublicId(notification.file_url);
    if (publicId) {
      try {
        await deleteImageFromCloudinary(publicId);
        console.log(`Deleted file with public_id: ${publicId} from Cloudinary`);
      } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
        // Continue deletion even if file removal fails.
      }
    }
  }

  await notification.destroy();

  res.status(200).json({
    success: true,
    message: "Notification deleted successfully",
  });
});

/**
 * Mark a single notification as read.
 */
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const notification = await Notification.findOne({
    where: { id, userId },
  });
  if (!notification) {
    throw new ApiError("Notification not found", 404);
  }

  if (!notification.is_read) {
    notification.is_read = true;
    notification.read_at = new Date();
    await notification.save();
  }

  res.status(200).json({
    success: true,
    data: notification,
    message: "Notification marked as read",
  });
});

/**
 * Mark all notifications as read for the authenticated user.
 */
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await Notification.update(
    { is_read: true, read_at: new Date() },
    { where: { userId, is_read: false } }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

/**
 * Retrieve the count of unread notifications for the authenticated user.
 */
export const getUnreadNotificationCount = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const unreadCount = await Notification.count({
    where: { userId, is_read: false },
  });

  res.status(200).json({
    success: true,
    data: { unreadCount },
    message: "Unread notifications count retrieved successfully",
  });
});
