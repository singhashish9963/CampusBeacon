import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Role, UserRole } from "../models/role.model.js";
import { User } from "../models/user.model.js";

// Create Role
export const createRole = asyncHandler(async (req, res) => {
  const { role_name } = req.body;
  if (!role_name) {
    throw new ApiError("Role name is required", 400);
  }
  const role = await Role.create({ role_name });
  res.status(201).json(new ApiResponse(201, role, "Role created successfully"));
});

// Assign Role to User
export const assignRole = asyncHandler(async (req, res) => {
  const { user_id, role_id } = req.body;
  if (!user_id || !role_id) {
    throw new ApiError("User ID and Role ID are required", 400);
  }
  const userRole = await UserRole.create({ user_id, role_id });
  res
    .status(201)
    .json(new ApiResponse(201, userRole, "Role assigned to user successfully"));
});

// Remove Role from User
export const removeRole = asyncHandler(async (req, res) => {
  const { user_id, role_id } = req.body;
  if (!user_id || !role_id) {
    throw new ApiError("User ID and Role ID are required", 400);
  }
  const userRole = await UserRole.destroy({ where: { user_id, role_id } });
  res
    .status(200)
    .json(new ApiResponse(200, null, "Role removed from user successfully"));
});
