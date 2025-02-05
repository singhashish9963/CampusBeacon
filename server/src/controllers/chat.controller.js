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