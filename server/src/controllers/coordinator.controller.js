import asyncHandler from "../utils/asyncHandler.js";
import { Coordinator } from "../models/coordinators.model.js";
import { Club } from "../models/clubs.model.js";
import { EventCoordinator } from "../models/eventcoordinator.model.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";
import ApiError from "../utils/apiError.js";

export const createCoordinator = asyncHandler(async (req, res) => {
  const { name, designation, contact, social_media_links, club_id } = req.body;

  if (!name || !designation || !club_id) {
    throw new ApiError(400, "Missing required coordinator details");
  }

  // Check if club exists
  const clubExists = await Club.findByPk(club_id);
  if (!clubExists) {
    throw new ApiError(404, "Club not found");
  }

  // Process uploaded images
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadImageToCloudinary(file.path)
    );
    imageUrls = await Promise.all(uploadPromises);
  }

  if (social_media_links) {
    try {
      const parsedLinks = JSON.parse(social_media_links);
      if (!Array.isArray(parsedLinks)) {
        throw new Error();
      }
    } catch {
      throw new ApiError(
        400,
        "Invalid social_media_links format. Must be a JSON array."
      );
    }
  }

  const coordinator = await Coordinator.create({
    name,
    designation,
    contact: contact || null,
    club_id,
    images: imageUrls,
    social_media_links: social_media_links
      ? JSON.parse(social_media_links)
      : [],
  });

  return res.status(201).json({
    success: true,
    coordinator,
  });
});

export const getAllCoordinators = asyncHandler(async (req, res) => {
  const { club_id } = req.query;

  let whereClause = {};
  if (club_id) {
    whereClause.club_id = club_id;
  }

  const coordinators = await Coordinator.findAll({
    where: whereClause,
    include: [
      {
        model: Club,
        attributes: ["id", "name"],
      },
    ],
  });

  return res.status(200).json({
    success: true,
    coordinators,
  });
});

export const getCoordinatorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const coordinator = await Coordinator.findByPk(id, {
    include: [
      {
        model: Club,
        attributes: ["id", "name"],
      },
    ],
  });

  if (!coordinator) {
    throw new ApiError(404, "Coordinator not found");
  }

  return res.status(200).json({
    success: true,
    coordinator,
  });
});

export const updateCoordinator = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, designation, contact, social_media_links, club_id } = req.body;

  const coordinator = await Coordinator.findByPk(id);

  if (!coordinator) {
    throw new ApiError(404, "Coordinator not found");
  }

  // Check if club exists if club_id is provided
  if (club_id) {
    const clubExists = await Club.findByPk(club_id);
    if (!clubExists) {
      throw new ApiError(404, "Club not found");
    }
  }

  // Process new uploaded images
  let newImageUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadImageToCloudinary(file.path)
    );
    newImageUrls = await Promise.all(uploadPromises);
  }

  // Update coordinator
  coordinator.name = name || coordinator.name;
  coordinator.designation = designation || coordinator.designation;
  coordinator.contact = contact || coordinator.contact;
  coordinator.club_id = club_id || coordinator.club_id;

  if (social_media_links) {
    try {
      const parsedLinks = JSON.parse(social_media_links);
      if (!Array.isArray(parsedLinks)) {
        throw new Error();
      }
      coordinator.social_media_links = parsedLinks;
    } catch {
      throw new ApiError(
        400,
        "Invalid social_media_links format. Must be a JSON array."
      );
    }
  }

  if (newImageUrls.length > 0) {
    if (req.body.deleteExistingImages === "true") {
      // Delete old images
      const deletePromises = coordinator.images.map((imageUrl) =>
        deleteImageFromCloudinary(imageUrl)
      );
      await Promise.all(deletePromises);
      coordinator.images = newImageUrls;
    } else {
      coordinator.images = [...coordinator.images, ...newImageUrls];
    }
  }

  await coordinator.save();

  return res.status(200).json({
    success: true,
    coordinator,
  });
});

export const deleteCoordinator = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const coordinator = await Coordinator.findByPk(id);

  if (!coordinator) {
    throw new ApiError(404, "Coordinator not found");
  }

  // Delete images from cloudinary
  if (coordinator.images && coordinator.images.length > 0) {
    const deletePromises = coordinator.images.map((imageUrl) =>
      deleteImageFromCloudinary(imageUrl)
    );
    await Promise.all(deletePromises);
  }

  // Delete associations with events
  await EventCoordinator.destroy({
    where: { coordinator_id: id },
  });

  await coordinator.destroy();

  return res.status(200).json({
    success: true,
    message: "Coordinator deleted successfully",
  });
});
