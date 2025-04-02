import asyncHandler from "../utils/asyncHandler.js";
import { Club } from "../models/clubs.model.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";

export const createClub = asyncHandler(async (req, res) => {
  const { name, description, social_media_links } = req.body;

  if (!name) {
    throw new ApiError(400, "Club name is required");
  }

  // Process uploaded images
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadImageToCloudinary(file.path)
    );
    imageUrls = await Promise.all(uploadPromises);
  }

  const club = await Club.create({
    name,
    description,
    images: imageUrls,
    social_media_links: social_media_links
      ? JSON.parse(social_media_links)
      : [],
  });

  return res.status(201).json({
    success: true,
    club,
  });
});

export const getAllClubs = asyncHandler(async (req, res) => {
  const clubs = await Club.findAll();

  return res.status(200).json({
    success: true,
    clubs,
  });
});

export const getClubById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const club = await Club.findByPk(id);

  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  return res.status(200).json({
    success: true,
    club,
  });
});

export const updateClub = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, social_media_links } = req.body;

  const club = await Club.findByPk(id);

  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  // Process new uploaded images
  let newImageUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadImageToCloudinary(file.path)
    );
    newImageUrls = await Promise.all(uploadPromises);
  }

  // Update club
  club.name = name || club.name;
  club.description = description || club.description;

  if (social_media_links) {
    club.social_media_links = JSON.parse(social_media_links);
  }

  if (newImageUrls.length > 0) {
    // Delete old images if requested
    if (req.body.deleteExistingImages === "true") {
      const deletePromises = club.images.map((imageUrl) =>
        deleteImageFromCloudinary(imageUrl)
      );
      await Promise.all(deletePromises);
      club.images = newImageUrls;
    } else {
      club.images = [...club.images, ...newImageUrls];
    }
  }

  await club.save();

  return res.status(200).json({
    success: true,
    club,
  });
});

export const deleteClub = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const club = await Club.findByPk(id);

  if (!club) {
    throw new ApiError(404, "Club not found");
  }

  // Delete images from cloudinary
  if (club.images && club.images.length > 0) {
    const deletePromises = club.images.map((imageUrl) =>
      deleteImageFromCloudinary(imageUrl)
    );
    await Promise.all(deletePromises);
  }

  await club.destroy();

  return res.status(200).json({
    success: true,
    message: "Club deleted successfully",
  });
});
