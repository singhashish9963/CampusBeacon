import { Contact } from "../models/contact.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

export const createContacts = asyncHandler(async (req, res) => {
  const { name, email, phone, designation } = req.body;

  if (!name?.trim()) {
    throw new ApiError("Name is required", 400);
  }

  if (!designation?.trim()) {
    throw new ApiError("Designation is required", 400);
  }

  let image_url = null;
  if (req.file) {
    const uploadResult = await uploadImageToCloudinary(
      req.file.path,
      "contacts"
    );
    image_url = uploadResult?.url;
  }

  const newContact = await Contact.create({
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

  const contact = await Contact.findByPk(id);
  if (!contact) {
    throw new ApiError("Contact not found", 404);
  }

  let image_url = contact.image_url;
  if (req.file) {
    const uploadResult = await uploadImageToCloudinary(
      req.file.path,
      "contacts"
    );
    image_url = uploadResult?.url;
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

  const contact = await Contact.findByPk(id);
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

  const contact = await Contact.findByPk(id);
  if (!contact) {
    throw new ApiError("Contact not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, contact, "Contact retrieved successfully"));
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const allContacts = await Contact.findAll();

  return res
    .status(200)
    .json(
      new ApiResponse(200, allContacts, "All contacts retrieved successfully")
    );
});
