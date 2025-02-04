import BuyAndSell from "../models/buyandsell.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";


export const createBuyAndSellItem = asyncHandler(async (req, res) => {
  const {
    item_name,
    description,
    location_found,
    date_bought,
    owner_contact,
    item_condition,
    price,
  } = req.body;
  if(price<0) throw new ApiError("price must be positive",405)

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
    location_found,
    date_bought: date_bought || new Date(),
    owner_contact,
    image_url,
    userId, 
    item_condition,
    price,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newItem, "Buy and sell item created successfully")
    );
});

export const updateBuyAndSellItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    item_name,
    description,
    location_found,
    date_bought,
    owner_contact,
    item_condition,
    price,
  } = req.body;

  const item = await BuyAndSell.findByPk(id);
  if (!item) {
    throw new ApiError("Item not found", 404);
  }


  if (item.userId !== req.user?.id) {
    throw new ApiError("Unauthorized to update this item", 403);
  }

  if (item_condition && !["Good", "Fair", "Poor"].includes(item_condition)) {
    throw new ApiError(
      "Valid item condition is required (Good, Fair, or Poor)",
      400
    );
  }

  let image_url = item.image_url;
  if (req.file) {
    image_url = await uploadImageToCloudinary(req.file.path, "buy-and-sell");
  }

  item.item_name = item_name || item.item_name;
  item.description = description || item.description;
  item.location_found = location_found || item.location_found;
  item.date_bought = date_bought || item.date_bought;
  item.owner_contact = owner_contact || item.owner_contact;
  item.item_condition = item_condition || item.item_condition;
  item.image_url = image_url;
  item.price=price

  await item.save();

  return res
    .status(200)
    .json(new ApiResponse(200, item, "Buy and sell item updated successfully"));
});

export const deleteBuyAndSellItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await BuyAndSell.findByPk(id);
  if (!item) {
    throw new ApiError("Item not found", 404);
  }

  
  if (item.userId !== req.user?.id) {
    throw new ApiError("Unauthorized to delete this item", 403);
  }

  await item.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Buy and sell item deleted successfully"));
});

export const getBuyAndSellItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await BuyAndSell.findByPk(id, {
    include: ["User"], 
  });

  if (!item) {
    throw new ApiError("Item not found", 404);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, item, "Buy and sell item retrieved successfully")
    );
});

export const getAllBuyAndSellItems = asyncHandler(async (req, res) => {
  const { condition, sort } = req.query;

  let whereClause = {};
  let orderClause = [["createdAt", "DESC"]];

  if (condition && ["Good", "Fair", "Poor"].includes(condition)) {
    whereClause.item_condition = condition;
  }

  if (sort) {
    switch (sort) {
      case "newest":
        orderClause = [["createdAt", "DESC"]];
        break;
      case "oldest":
        orderClause = [["createdAt", "ASC"]];
        break;
      case "name_asc":
        orderClause = [["item_name", "ASC"]];
        break;
      case "name_desc":
        orderClause = [["item_name", "DESC"]];
        break;
    }
  }

  const items = await BuyAndSell.findAll({
    where: whereClause,
    order: orderClause,
    include: ["User"],
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        items,
        "All buy and sell items retrieved successfully"
      )
    );
});

export const getUserItems = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user?.id;

  const items = await BuyAndSell.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    include: ["User"], 
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        items,
        "User's buy and sell items retrieved successfully"
      )
    );
});
