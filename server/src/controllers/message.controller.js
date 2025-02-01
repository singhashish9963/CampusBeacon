import { message } from "../models/message.model";
import asyncHandler from "../utils/asyncHandler.js"
import apiError from "../utils/apiError.js"
import apiResponse from "../utils/apiResponse.js"




export const createMessage = asyncHandler(async (req, res) => {
  const { channelId, registration_number, messages } = req.body;

  if (!channelId || !registration_number || !messages?.trim()) {
    throw new apiError("All fields are required", 400);
  }

  const newMessage = await message.create({
    channelId,
    registration_number,
    messages,
  });
  return res
    .status(201)
    .json(new apiResponse(201, newMessage, "Message sent successfully"));
});