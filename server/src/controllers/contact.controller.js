import { Contacts } from "../models/contact.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";

export const createContacts = asyncHandler(async (req, res) => {
  const { name, email, phone, designation } = req.body;

  if (!name?.trim()) {
    throw new ApiError("Name is required", 400);
  }

  if (!designation?.trim()) {
    throw new ApiError("Designation is required", 400);
  }

  let image_url = null;

  console.log("Received file:", req.file);

  try {
    if (req.file) {
      if (!fs.existsSync(req.file.path)) {
        throw new Error("Uploaded file not found at path: " + req.file.path);
      }

      console.log("Attempting to upload file:", req.file.path);
      const uploadResult = await uploadImageToCloudinary(
        req.file.path,
        "contacts"
      );

      if (!uploadResult) {
        throw new Error("Upload returned null");
      }


      image_url = uploadResult
      console.log("Cloudinary upload successful:", uploadResult.secure_url);
    }
  } catch (error) {
    console.error("Image upload error:", error);
    throw new ApiError(`Error uploading image: ${error.message}`, 400);
  }

  const newContact = await Contacts.create({
    name,
    email,
    phone,
    designation,
    image_url,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newContact, "Contact created successfully"));
});

export const editContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, designation } = req.body;

  const contact = await Contacts.findByPk(id);
  if (!contact) {
    throw new ApiError("Contact not found", 404);
  }

  let image_url = contact.image_url;
  if (req.file) {
    const uploadResult = await uploadImageToCloudinary(
      req.file.path,
      "contacts"
    );
    image_url = uploadResult?.secure_url || image_url;
  }

  contact.name = name || contact.name;
  contact.email = email || contact.email;
  contact.phone = phone || contact.phone;
  contact.designation = designation || contact.designation;
  contact.image_url = image_url;

  await contact.save();

  return res
    .status(200)
    .json(new ApiResponse(200, contact, "Contact updated successfully"));
});

export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contacts.findByPk(id);
  if (!contact) {
    throw new ApiError("Contact not found", 404);
  }

  await contact.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Contact deleted successfully"));
});

export const getContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contacts.findByPk(id);
  if (!contact) {
    throw new ApiError("Contact not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, contact, "Contact retrieved successfully"));
});

export const getAllContacts = asyncHandler(async (_, res) => {
  const allContacts = await Contacts.findAll();

  return res
    .status(200)
    .json(
      new ApiResponse(200, allContacts, "All contacts retrieved successfully")
    );
});
