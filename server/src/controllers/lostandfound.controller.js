import LostAndFound from "../models/lostandfound.model";
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"



export const createLostItem = asyncHandler(async (req, res) => {
  const {
    item_name,
    description,
    location_found,
    date_found,
    owner_contact,
    registration_number,
  } = req.body;


  if (!item_name?.trim()) {
    throw new ApiError("Item name is required", 400);
  }

  if (!registration_number?.trim()) {
    throw new ApiError("Registration number is required", 400);
  }


  let image_url;
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
    registration_number,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newItem, "Lost and found item created successfully")
    );
});


