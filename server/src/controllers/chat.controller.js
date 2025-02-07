import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Channel from "../models/channel.model.js";
import Message from "../models/message.model.js";

const getMessages = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channel = await Channel.findOne({
    where: { name: channelId.toLowerCase() },
  });

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  try {
    const messages = await Message.findAll({
      where: { channelId: channel.id },
      order: [["createdAt", "DESC"]],
      limit: 50,
      raw: true,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, messages, "Messages fetched successfully"));
  } catch (error) {
    console.error("Database error:", error);
    throw new ApiError(500, "Error fetching messages");
  }
});

const createMessage = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;
  const currentTime = new Date()

  if (!content?.trim()) {
    throw new ApiError(400, "Message content is required");
  }

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const channel = await Channel.findOne({
    where: { name: channelId.toLowerCase() },
  });

  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  try {
    const message = await Message.create({
      content: content.trim(),
      userId,
      channelId: channel.id,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    if (req.io) {
      req.io.to(`channel-${channel.id}`).emit("new-message", message);
    }

    return res
      .status(201)
      .json(new ApiResponse(201, message, "Message created successfully"));
  } catch (error) {
    console.error("Database error:", error);
    throw new ApiError(500, "Error creating message");
  }
});

const getChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.findAll({
    order: [["name", "ASC"]],
    raw: true,
  });

  if (!channels?.length) {
    throw new ApiError(404, "No channels found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Channels fetched successfully"));
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const message = await Message.findByPk(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.userId !== userId) {
    throw new ApiError(403, "Not authorized to delete this message");
  }

  try {
    await message.destroy();

    if (req.io) {
      req.io
        .to(`channel-${message.channelId}`)
        .emit("message-deleted", messageId);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { messageId }, "Message deleted successfully")
      );
  } catch (error) {
    console.error("Database error:", error);
    throw new ApiError(500, "Error deleting message");
  }
});

export { getChannels, getMessages, createMessage, deleteMessage };
