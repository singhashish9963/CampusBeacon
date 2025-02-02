import { Op } from "sequelize";
import users from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";


export const getUser = asyncHandler(async (req, res) => {
  const { appwriteId } = req.params;

  if (!appwriteId || !appwriteId.trim())
    throw new ApiError(400, "User ID is required");
  if (req.user.appwrite_id !== appwriteId)
    throw new ApiError(403, "Unauthorized access");

  const user = await users.findOne({ where: { appwrite_id: appwriteId } });
  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});


export const deleteUser = asyncHandler(async (req, res) => {
  const { appwriteId } = req.params;

  if (!appwriteId || !appwriteId.trim())
    throw new ApiError(400, "User ID is required");
  if (req.user.appwrite_id !== appwriteId)
    throw new ApiError(403, "Unauthorized access");

  const user = await users.findOne({ where: { appwrite_id: appwriteId } });
  if (!user) throw new ApiError(404, "User not found");

  await user.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});


export const updateUser = asyncHandler(async (req, res) => {
  const { appwriteId } = req.params;

  if (!appwriteId?.trim()) throw new ApiError(400, "User ID is required");
  if (req.user.appwrite_id !== appwriteId)
    throw new ApiError(403, "Unauthorized access");

  const user = await users.findOne({ where: { appwrite_id: appwriteId } });
  if (!user) throw new ApiError(404, "User not found");

  const {
    name,
    registration_number,
    semester,
    branch,
    hostel,
    graduation_year,
  } = req.body;
  if (!name || !semester || !graduation_year)
    throw new ApiError(400, "Missing required fields");

  if (registration_number && registration_number !== user.registration_number) {
    const existingUser = await users.findOne({
      where: { registration_number },
    });
    if (existingUser)
      throw new ApiError(400, "Registration number already in use");
  }

  await user.update({
    name: name ?? user.name,
    registration_number: registration_number ?? user.registration_number,
    semester: semester ?? user.semester,
    branch: branch ?? user.branch,
    hostel: hostel ?? user.hostel,
    graduation_year: graduation_year ?? user.graduation_year,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});


export const getAllUser = asyncHandler(async (req, res) => {
  const allUsers = await users.findAll();
  return res
    .status(200)
    .json(new ApiResponse(200, allUsers, "Users fetched successfully"));
});
