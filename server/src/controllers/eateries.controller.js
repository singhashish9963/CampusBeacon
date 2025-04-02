import Eateries from "../models/eateries.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";

const isValidTimeFormat = (timeString) => {
  if (!timeString) return true;
  return /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(timeString);
};

export const createEatery = asyncHandler(async (req, res) => {
  const { name, location, description, phoneNumber, openingTime, closingTime } =
    req.body;

  if (!name?.trim()) {
    throw new ApiError(400, "Eatery name is required");
  }
  if (!location?.trim()) {
    throw new ApiError(400, "Eatery location is required");
  }

  if (!isValidTimeFormat(openingTime)) {
    throw new ApiError(400, "Invalid opening time format. Use HH:MM.");
  }
  if (!isValidTimeFormat(closingTime)) {
    throw new ApiError(400, "Invalid closing time format. Use HH:MM.");
  }

  let menuImageUrl = null;
  if (req.file) {
    try {
      menuImageUrl = await uploadImageToCloudinary(req.file.path);
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
    }
  }

  const newEateryData = {
    name: name.trim(),
    location: location.trim(),
    description: description || null,
    phoneNumber: phoneNumber || null,
    openingTime: openingTime || null,
    closingTime: closingTime || null,
    menuImageUrl,
  };

  try {
    const newEatery = await Eateries.create(newEateryData);
    return res
      .status(201)
      .json(new ApiResponse(201, newEatery, "Eatery created successfully"));
  } catch (dbError) {
    console.error("Database Error during Eateries.create:", dbError);
    if (dbError.name === "SequelizeValidationError") {
      const errors = dbError.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      throw new ApiError(400, "Validation failed", errors);
    }
    throw new ApiError(500, "Failed to create eatery in database.");
  }
});

export const updateEatery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, location, description, phoneNumber, openingTime, closingTime } =
    req.body; // Removed rating as it shouldn't be updated directly here

  // Validate time formats
  if (openingTime && !isValidTimeFormat(openingTime)) {
    throw new ApiError(400, "Invalid opening time format. Use HH:MM.");
  }
  if (closingTime && !isValidTimeFormat(closingTime)) {
    throw new ApiError(400, "Invalid closing time format. Use HH:MM.");
  }

  const eatery = await Eateries.findByPk(id);
  if (!eatery) {
    throw new ApiError(404, "Eatery not found");
  }

  const oldImageUrl = eatery.menuImageUrl; // Store the existing image URL
  let newMenuImageUrl = eatery.menuImageUrl; // Initialize with current URL

  // If a new file is uploaded, process it
  if (req.file) {
    try {
      newMenuImageUrl = await uploadImageToCloudinary(req.file.path); // Upload new image

      // If upload is successful AND there was an old image, delete the old one
      if (newMenuImageUrl && oldImageUrl) {
        try {
          await deleteImageFromCloudinary(oldImageUrl);
          console.log(`Deleted old image from Cloudinary: ${oldImageUrl}`);
        } catch (deleteError) {
          console.error(
            `Failed to delete old image ${oldImageUrl} during update for eatery ${id}:`,
            deleteError
          );
          // Decide if you want to proceed or throw an error - usually proceed
        }
      }
    } catch (uploadError) {
      console.error(
        `Cloudinary upload failed during update for eatery ${id}:`,
        uploadError
      );
      // Handle upload error - perhaps throw an ApiError or just don't update the image URL
      // For now, we'll proceed without updating the image URL if upload fails
      newMenuImageUrl = oldImageUrl; // Revert to old URL if upload fails
      // Optional: throw new ApiError(500, "Failed to upload new menu image.");
    }
  }

  // Update eatery fields
  eatery.name = name?.trim() || eatery.name;
  eatery.location = location?.trim() || eatery.location;
  eatery.description = description ?? eatery.description; // Use ?? to allow empty string ""
  eatery.phoneNumber = phoneNumber ?? eatery.phoneNumber;
  eatery.openingTime = openingTime ?? eatery.openingTime;
  eatery.closingTime = closingTime ?? eatery.closingTime;
  eatery.menuImageUrl = newMenuImageUrl; // Assign the potentially new URL

  // Save changes to the database
  try {
    await eatery.save();
  } catch (dbError) {
    console.error(`Database Error during eatery.save for ID ${id}:`, dbError);
    if (dbError.name === "SequelizeValidationError") {
      const errors = dbError.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      throw new ApiError(400, "Validation failed", errors);
    }
    throw new ApiError(500, `Failed to update eatery ${id} in database.`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, eatery, "Eatery updated successfully"));
});

export const deleteEatery = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const eatery = await Eateries.findByPk(id);
  if (!eatery) {
    throw new ApiError(404, "Eatery not found"); // Consistent ApiError constructor
  }

  const imageUrlToDelete = eatery.menuImageUrl; // Store URL before potentially deleting eatery

  // First, attempt to delete from the database
  await eatery.destroy();

  // If database deletion was successful, attempt to delete image from Cloudinary
  if (imageUrlToDelete) {
    try {
      await deleteImageFromCloudinary(imageUrlToDelete);
      console.log(
        `Deleted associated image from Cloudinary: ${imageUrlToDelete}`
      );
    } catch (cloudinaryError) {
      // Log the error, but don't fail the request since the DB entry is gone
      console.error(
        `Failed to delete image ${imageUrlToDelete} from Cloudinary after deleting eatery ${id}:`,
        cloudinaryError
      );
    }
  }

  return (
    res
      .status(200)
      // Send 200 for successful deletion, 204 might also be appropriate (No Content)
      .json(new ApiResponse(200, { id }, "Eatery deleted successfully"))
  ); // Return deleted ID
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

export const rateEatery = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError("Invalid rating. Must be between 1 and 5", 400);
  }

  const eatery = await Eateries.findByPk(id);
  if (!eatery) {
    throw new ApiError("Eatery not found", 404);
  }

  eatery.ratingSum = (eatery.ratingSum || 0) + rating;
  eatery.totalRatings = (eatery.totalRatings || 0) + 1;
  eatery.rating = eatery.ratingSum / eatery.totalRatings;

  await eatery.save();

  return res
    .status(200)
    .json(new ApiResponse(200, eatery, "Rating submitted successfully"));
});
