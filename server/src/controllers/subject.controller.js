import { Subject } from "../models/subject.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import UserSubjects from "../models/userSubjects.model.js";

/*
=============================
  Get all subjects (Dropdown)
=============================
*/
export const getAllSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.findAll();
  return res
    .status(200)
    .json(
      new ApiResponse(200, subjects, "All subjects retrieved successfully")
    );
});

/*
=========================================
  Get subjects selected by a specific user
=========================================
*/
export const getUserSubjects = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId, {
    include: {
      model: Subject,
      through: { attributes: [] }, // Exclude the pivot table attributes
    },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.subjects,
        "User subjects retrieved successfully"
      )
    );
});

/*
===================================
  Add a subject to a user's selection
===================================
*/
export const addUserSubject = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { subjectId } = req.body;

  if (!subjectId) {
    throw new ApiError("Subject ID is required", 400);
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const subject = await Subject.findByPk(subjectId);
  if (!subject) {
    throw new ApiError("Subject not found", 404);
  }

  const [userSubject, created] = await UserSubjects.findOrCreate({
    where: { userId, subjectId },
  });

  if (!created) {
    throw new ApiError("Subject already added", 400);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, userSubject, "Subject added successfully"));
});

/*
===================================
  Remove a subject from user's selection
===================================
*/
export const removeUserSubject = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { subjectId } = req.body;

  if (!subjectId) {
    throw new ApiError("Subject ID is required", 400);
  }

  const userSubject = await UserSubjects.findOne({
    where: { userId, subjectId },
  });

  if (!userSubject) {
    throw new ApiError("Subject not found for the user", 404);
  }

  await userSubject.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subject removed successfully"));
});

/*
===================================
  Add a new subject (Admin)
===================================
*/
export const addSubject = asyncHandler(async (req, res) => {
  const { name, code } = req.body;

  if (!name?.trim() || !code?.trim()) {
    throw new ApiError("Subject name and code are required", 400);
  }

  const existingSubject = await Subject.findOne({ where: { code } });
  if (existingSubject) {
    throw new ApiError("Subject with this code already exists", 400);
  }

  const newSubject = await Subject.create({ name, code });

  return res
    .status(201)
    .json(new ApiResponse(201, newSubject, "Subject added successfully"));
});

/*
===================================
  Edit a subject (Admin)
===================================
*/
export const editSubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const { name, code } = req.body;

  const subject = await Subject.findByPk(subjectId);
  if (!subject) {
    throw new ApiError("Subject not found", 404);
  }

  if (name) subject.name = name;
  if (code) subject.code = code;

  await subject.save();

  return res
    .status(200)
    .json(new ApiResponse(200, subject, "Subject updated successfully"));
});

/*
===================================
  Delete a subject (Admin)
===================================
*/
export const deleteSubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;

  const subject = await Subject.findByPk(subjectId);
  if (!subject) {
    throw new ApiError("Subject not found", 404);
  }

  await subject.destroy();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subject deleted successfully"));
});
