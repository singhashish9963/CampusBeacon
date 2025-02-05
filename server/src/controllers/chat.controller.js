
import { asyncHandler } from "../utils/asyncHandler.js";
import  ApiError  from "../utils/apiError.js";
import  ApiResponse from "../utils/apiResponse.js"
import Channel from "../models/Channel.js";
import Message from "../models/Message.js";

const getChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.findAll({
    order: [["name", "ASC"]],
  });

  if (!channels) {
    throw new ApiError(404, "No channels found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Channels fetched successfully"));
});

const getMessages = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channel = await Channel.findByPk(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const messages = await Message.findAll({
    where: { channelId },
    order: [["timestamp", "DESC"]],
    limit: 50,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

const createMessage = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;

  if (!content?.trim()) {
    throw new ApiError(400, "Message content is required");
  }

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const channel = await Channel.findByPk(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const message = await Message.create({
    content: content.trim(),
    userId,
    channelId,
    timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
  });

  if (req.io) {
    req.io.to(`channel-${channelId}`).emit("new-message", message);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, message, "Message created successfully"));
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

  await message.destroy();

  if (req.io) {
    req.io
      .to(`channel-${message.channelId}`)
      .emit("message-deleted", messageId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { messageId }, "Message deleted successfully"));
});

const editMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;

  if (!content?.trim()) {
    throw new ApiError(400, "Message content is required");
  }

  if (!userId) {
    throw new ApiError(401, "User not authenticated");
  }

  const message = await Message.findByPk(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.userId !== userId) {
    throw new ApiError(403, "Not authorized to edit this message");
  }


  message.content = content.trim();
  message.isEdited = true;
  message.editedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
  await message.save();

  if (req.io) {
    req.io.to(`channel-${message.channelId}`).emit("message-edited", message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message edited successfully"));
});

export { getChannels, getMessages, createMessage, deleteMessage, editMessage };
