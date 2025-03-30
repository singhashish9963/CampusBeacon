import asyncHandler from "../utils/asyncHandler.js";
import { Message, Channel, ChannelMember } from "../models/chat.model.js";
import redis from "../config/redis.js";

// Get all channels for a user
export const getChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.findAll({
    include: [
      {
        model: ChannelMember,
        where: { userId: req.user.id },
        required: true,
      },
    ],
  });

  res.status(200).json({
    success: true,
    data: channels,
  });
});

// Create a new channel
export const createChannel = asyncHandler(async (req, res) => {
  const { name, description, type, members } = req.body;

  const channel = await Channel.create({
    name,
    description,
    type,
    createdBy: req.user.id,
  });

  // Add creator as admin
  await ChannelMember.create({
    channelId: channel.id,
    userId: req.user.id,
    role: "admin",
  });

  // Add other members
  if (members && members.length > 0) {
    const memberPromises = members.map((userId) =>
      ChannelMember.create({
        channelId: channel.id,
        userId,
        role: "member",
      })
    );
    await Promise.all(memberPromises);
  }

  res.status(201).json({
    success: true,
    data: channel,
  });
});

// Get messages for a channel
export const getMessages = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  // Check if user is member of the channel
  const isMember = await ChannelMember.findOne({
    where: {
      channelId,
      userId: req.user.id,
    },
  });

  if (!isMember) {
    return res.status(403).json({
      success: false,
      message: "You are not a member of this channel",
    });
  }

  // Try to get messages from Redis cache first
  const cachedMessages = await redis.lrange(
    `channel:${channelId}:messages`,
    0,
    -1
  );

  if (cachedMessages.length > 0) {
    return res.status(200).json({
      success: true,
      data: cachedMessages.map((msg) => JSON.parse(msg)),
    });
  }

  // If not in cache, get from database
  const messages = await Message.findAll({
    where: { channelId },
    order: [["createdAt", "DESC"]],
    limit: parseInt(limit),
    offset: (page - 1) * limit,
    include: [
      {
        model: User,
        attributes: ["id", "name", "avatar"],
      },
    ],
  });

  res.status(200).json({
    success: true,
    data: messages,
  });
});

// Get channel members
export const getChannelMembers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const members = await ChannelMember.findAll({
    where: { channelId },
    include: [
      {
        model: User,
        attributes: ["id", "name", "avatar", "email"],
      },
    ],
  });

  res.status(200).json({
    success: true,
    data: members,
  });
});

// Update channel
export const updateChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { name, description, type } = req.body;

  // Check if user is admin
  const isAdmin = await ChannelMember.findOne({
    where: {
      channelId,
      userId: req.user.id,
      role: "admin",
    },
  });

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You are not an admin of this channel",
    });
  }

  const channel = await Channel.update(
    { name, description, type },
    {
      where: { id: channelId },
      returning: true,
    }
  );

  res.status(200).json({
    success: true,
    data: channel[1][0],
  });
});

// Delete channel
export const deleteChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // Check if user is admin
  const isAdmin = await ChannelMember.findOne({
    where: {
      channelId,
      userId: req.user.id,
      role: "admin",
    },
  });

  if (!isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You are not an admin of this channel",
    });
  }

  await Channel.destroy({
    where: { id: channelId },
  });

  // Clear Redis cache
  await redis.del(`channel:${channelId}:messages`);
  await redis.del(`channel:${channelId}:members`);

  res.status(200).json({
    success: true,
    message: "Channel deleted successfully",
  });
});
