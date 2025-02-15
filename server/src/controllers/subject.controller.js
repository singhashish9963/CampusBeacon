import { Subject } from "../models/subject.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import UserSubjects from "../models/userSubjects.model.js";

/**
 * @desc    Get all subjects for dropdown
 * @route   GET /api/subjects
 * @access  Public
 */
export const getAllSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.findAll({
    attributes: ["id", "name", "code", "icon"],
    order: [["name", "ASC"]],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, subjects, "Subjects retrieved successfully"));
});

/**
 * @desc    Get subjects for a specific user
 * @route   GET /api/subjects/user/:userId
 * @access  Private
 */
export const getUserSubjects = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByPk(userId, {
    include: {
      model: Subject,
      through: { attributes: [] },
      attributes: ["id", "name", "code", "icon"],
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

/**
 * @desc    Add a subject to user's selection
 * @route   POST /api/subjects/user/:userId/add
 * @access  Private
 */
export const addUserSubject = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { subjectId } = req.body;

  if (!subjectId) {
    throw new ApiError("Subject ID is required", 400);
  }

  // Check if both user and subject exist
  const [user, subject] = await Promise.all([
    User.findByPk(userId),
    Subject.findByPk(subjectId),
  ]);

  if (!user) throw new ApiError("User not found", 404);
  if (!subject) throw new ApiError("Subject not found", 404);

  const [userSubject, created] = await UserSubjects.findOrCreate({
    where: { userId, subjectId },
  });

  if (!created) {
    throw new ApiError("Subject already added to user", 400);
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { userId, subjectId },
        "Subject added to user successfully"
      )
    );
});

/**
 * @desc    Remove a subject from user's selection
 * @route   DELETE /api/subjects/user/:userId/remove
 * @access  Private
 */
export const removeUserSubject = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { subjectId } = req.body;

  if (!subjectId) {
    throw new ApiError("Subject ID is required", 400);
  }

  const deleted = await UserSubjects.destroy({
    where: { userId, subjectId },
  });

  if (!deleted) {
    throw new ApiError("Subject not found for the user", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subject removed from user successfully"));
});

/**
 * @desc    Add a new subject (Admin only)
 * @route   POST /api/subjects
 * @access  Admin
 */
export const addSubject = asyncHandler(async (req, res) => {
  const { name, code, icon } = req.body;

  if (!name?.trim() || !code?.trim()) {
    throw new ApiError("Subject name and code are required", 400);
  }

  const existingSubject = await Subject.findOne({
    where: { code },
  });

  if (existingSubject) {
    throw new ApiError("Subject with this code already exists", 400);
  }

  const newSubject = await Subject.create({
    name,
    code,
    icon: icon || "📚", // Use default icon if not provided
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newSubject, "Subject created successfully"));
});

/**
 * @desc    Update a subject (Admin only)
 * @route   PUT /api/subjects/:subjectId
 * @access  Admin
 */
export const editSubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const { name, code, icon } = req.body;

  const subject = await Subject.findByPk(subjectId);
  if (!subject) {
    throw new ApiError("Subject not found", 404);
  }

  if (code && code !== subject.code) {
    const existingSubject = await Subject.findOne({ where: { code } });
    if (existingSubject) {
      throw new ApiError("Subject with this code already exists", 400);
    }
  }

  const updatedSubject = await subject.update({
    name: name || subject.name,
    code: code || subject.code,
    icon: icon || subject.icon,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSubject, "Subject updated successfully"));
});

/**
 * @desc    Delete a subject (Admin only)
 * @route   DELETE /api/subjects/:subjectId
 * @access  Admin
 */
export const deleteSubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;

  const deleted = await Subject.destroy({
    where: { id: subjectId },
  });

  if (!deleted) {
    throw new ApiError("Subject not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Subject deleted successfully"));
});
