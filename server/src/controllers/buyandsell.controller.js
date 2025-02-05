import BuyAndSell from "../models/buyandsell.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

export const createBuyAndSellItem = asyncHandler(async (req, res) => {
  const {
    item_name,
    description,
    date_bought,
    owner_contact,
    item_condition,
    price,
  } = req.body;

  if (price < 0) throw new ApiError("Price must be positive", 405);

  if (!item_name?.trim()) {
    throw new ApiError("Item name is required", 400);
  }

  if (!item_condition || !["Good", "Fair", "Poor"].includes(item_condition)) {
    throw new ApiError(
      "Valid item condition is required (Good, Fair, or Poor)",
      400
    );
  }

  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError("Authentication required", 401);
  }

  let image_url;
  if (req.file) {
    image_url = await uploadImageToCloudinary(req.file.path, "buy-and-sell");
  }

  const newItem = await BuyAndSell.create({
    item_name,
    description,
    date_bought: date_bought || new Date(),
    owner_contact,
    image_url,
    userId,
    item_condition,
    price,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newItem, "Item created successfully"));
});

export const updateBuyAndSellItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    item_name,
    description,
    date_bought,
    owner_contact,
    item_condition,
    price,
  } = req.body;

  const item = await BuyAndSell.findByPk(id);
  if (!item) throw new ApiError("Item not found", 404);

  if (item.userId !== req.user?.id) throw new ApiError("Unauthorized", 403);

  if (item_condition && !["Good", "Fair", "Poor"].includes(item_condition)) {
    throw new ApiError(
      "Valid item condition is required (Good, Fair, or Poor)",
      400
    );
  }

  if (price !== undefined && price < 0) {
    throw new ApiError("Price must be positive", 405);
  }

  let image_url = item.image_url;
  if (req.file) {
    image_url = await uploadImageToCloudinary(req.file.path, "buy-and-sell");
  }

  Object.assign(item, {
    item_name: item_name ?? item.item_name,
    description: description ?? item.description,
    date_bought: date_bought ?? item.date_bought,
    owner_contact: owner_contact ?? item.owner_contact,
    item_condition: item_condition ?? item.item_condition,
    image_url,
    price: price ?? item.price,
  });

  await item.save();
  return res
    .status(200)
    .json(new ApiResponse(200, item, "Item updated successfully"));
});

export const deleteBuyAndSellItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await BuyAndSell.findByPk(id);
  if (!item) throw new ApiError("Item not found", 404);

  if (item.userId !== req.user?.id) throw new ApiError("Unauthorized", 403);

  await item.destroy();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Item deleted successfully"));
});

export const getBuyAndSellItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await BuyAndSell.findByPk(id, {
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  if (!item) throw new ApiError("Item not found", 404);

  return res
    .status(200)
    .json(new ApiResponse(200, item, "Item retrieved successfully"));
});

export const getAllBuyAndSellItems = asyncHandler(async (req, res) => {
  const { condition, sort } = req.query;

  let whereClause = {};
  let orderClause = [["createdAt", "DESC"]];

  if (condition && ["Good", "Fair", "Poor"].includes(condition)) {
    whereClause.item_condition = condition;
  }

  if (sort) {
    const sortingOptions = {
      newest: [["createdAt", "DESC"]],
      oldest: [["createdAt", "ASC"]],
      name_asc: [["item_name", "ASC"]],
      name_desc: [["item_name", "DESC"]],
    };
    orderClause = sortingOptions[sort] || orderClause;
  }

  const items = await BuyAndSell.findAll({
    where: whereClause,
    order: orderClause,
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, items, "Items retrieved successfully"));
});

export const getUserItems = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user?.id;

  const items = await BuyAndSell.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, items, "User's items retrieved successfully"));
});
