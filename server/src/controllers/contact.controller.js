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

  let image_url;
  if (req.file) {
    image_url = await uploadImageToCloudinary(req.file.path, "contacts");
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

  const contacts = await Contact.findByPk(id);
  if (!contacts) {
    throw new ApiError("Contact was missing", 400);
  }

  let image_url = contacts.image_url;
  if (req.file) {
    image_url = await uploadImageToCloudinary(req.file.path, "contacts");
  }

  contacts.name = name || contacts.name;
  contacts.email = email || contacts.email;
  contacts.designation = designation || contacts.designation;
  contacts.phone = phone || contacts.phone;
  contacts.image_url = image_url;

  await contacts.save();

  return res
    .status(200)
    .json(new ApiResponse(200, contacts, "Contact updated successfully"));
});

export const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contacts = await Contact.findByPk(id);
  if (!contacts) {
    throw new ApiError("Contact was not found", 404);
  }
  await contacts.destroy();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Contact deleted successfully"));
});

export const getContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contacts = await Contact.findByPk(id);
  if (!contacts) {
    throw new ApiError("Contact was not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, contacts, "Contact retrieved successfully"));
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const allContacts = await Contact.findAll();
  return res
    .status(200)
    .json(
      new ApiResponse(200, allContacts, "All contacts retrieved successfully")
    );
});
