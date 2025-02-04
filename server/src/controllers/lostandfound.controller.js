import LostAndFound from "../models/lostandfound.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

export const createLostItem = asyncHandler(async (req, res) => {
  const { item_name, description, location_found, date_found, owner_contact } =
    req.body;

  if (!item_name?.trim()) {
    throw new ApiError("Item name is required", 400);
  }


  if (!req.user || !req.user.id) {
    throw new ApiError("User not authenticated", 401);
  }

  let image_url = null;
  if (req.file) {

    image_url = await uploadImageToCloudinary(req.file.path, "lost-and-found");
  }


  const newItem = await LostAndFound.create({
    item_name,
    description,
    location_found,
    date_found: date_found || new Date(),
    owner_contact,
    image_url,
    userId: req.user.id, 
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newItem, "Lost and found item created successfully")
    );
});

export const updateLostItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { item_name, description, location_found, date_found, owner_contact } =
    req.body;

  const item = await LostAndFound.findByPk(id);
  if (!item) {
    throw new ApiError("Item not found", 404);
  }


  if (req.user && item.userId !== req.user.id) {
    throw new ApiError("User is not authorized to update this item", 403);
  }

  let image_url = item.image_url;
  if (req.file) {
    image_url = await uploadImageToCloudinary(req.file.path, "lost-and-found");
  }


  item.item_name = item_name || item.item_name;
  item.description = description || item.description;
  item.location_found = location_found || item.location_found;
  item.date_found = date_found || item.date_found;
  item.owner_contact = owner_contact || item.owner_contact;
  item.image_url = image_url;

  await item.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, item, "Lost and found item updated successfully")
    );
});

export const deleteLostItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await LostAndFound.findByPk(id);
  if (!item) {
    throw new ApiError("Item not found", 404);
  }


  if (req.user && item.userId !== req.user.id) {
    throw new ApiError("User is not authorized to delete this item", 403);
  }

  await item.destroy();

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Lost and found item deleted successfully")
    );
});

export const getLostItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await LostAndFound.findByPk(id);
  if (!item) {
    throw new ApiError("Item not found", 404);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, item, "Lost and found item retrieved successfully")
    );
});

export const getAllLostItems = asyncHandler(async (req, res) => {
  const items = await LostAndFound.findAll({
    order: [["createdAt", "DESC"]],
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        items,
        "All lost and found items retrieved successfully"
      )
    );
});
