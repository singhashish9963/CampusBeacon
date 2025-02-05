import asyncHandler from "../utils/asyncHandler,js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import Channel from "../models/channel.model.js"
import Message from "../models/message.model.js"

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