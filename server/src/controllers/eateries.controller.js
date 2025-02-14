import Eateries from "../models/eateries.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

export const createEatery = asyncHandler(async (req, res) => {
  const {
    name,
    location,
    description,
    phoneNumber,
    openingTime,
    closingTime,
    rating,
  } = req.body;

  if (!name?.trim()) {
    throw new ApiError("Eatery name is required", 400);
  }

  let menuImageUrl = null;
  if (req.file) {
    menuImageUrl = await uploadImageToCloudinary(req.file.path, "eateries");
  }

  const newEatery = await Eateries.create({
    name,
    location,
    description,
    phoneNumber,
    openingTime,
    closingTime,
    rating,
    menuImageUrl,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newEatery, "Eatery created successfully"));
});

export const updateEatery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    location,
    description,
    phoneNumber,
    openingTime,
    closingTime,
    rating,
  } = req.body;

  const eatery = await Eateries.findByPk(id);
  if (!eatery) {
    throw new ApiError("Eatery not found", 404);
  }

  let menuImageUrl = eatery.menuImageUrl;
  if (req.file) {
    menuImageUrl = await uploadImageToCloudinary(req.file.path, "eateries");
  }

  eatery.name = name || eatery.name;
  eatery.location = location || eatery.location;
  eatery.description = description || eatery.description;
  eatery.phoneNumber = phoneNumber || eatery.phoneNumber;
  eatery.openingTime = openingTime || eatery.openingTime;
  eatery.closingTime = closingTime || eatery.closingTime;
  eatery.rating = rating || eatery.rating;
  eatery.menuImageUrl = menuImageUrl;

  await eatery.save();

  return res
    .status(200)
    .json(new ApiResponse(200, eatery, "Eatery updated successfully"));
});

export const deleteEatery = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const eatery = await Eateries.findByPk(id);
  if (!eatery) {
    throw new ApiError("Eatery not found", 404);
  }

  await eatery.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Eatery deleted successfully"));
});

export const getEatery = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const eatery = await Eateries.findByPk(id);
  if (!eatery) {
    throw new ApiError("Eatery not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, eatery, "Eatery retrieved successfully"));
});

export const getAllEateries = asyncHandler(async (req, res) => {
  const eateries = await Eateries.findAll({ order: [["createdAt", "DESC"]] });

  return res
    .status(200)
    .json(
      new ApiResponse(200, eateries, "All eateries retrieved successfully")
    );
});
