import users from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createUser = asyncHandler(async (req, res) => {
    const { name, registration_number, semester, branch, hostel, graduation_year } = req.body;

    const newUser = await users.create({
        name,
        registration_number,
        semester,
        branch,
        hostel,
        graduation_year,
    });
    
    return res
        .status(201)
        .json(new ApiResponse(201, newUser, "User created successfully"));
});

export const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id || !id.trim()) {
        throw new ApiError(400, "User ID is required");
    }

    if (req.user.id !== id) {
        throw new ApiError(403, "Unauthorized access");
    }

    const user = await users.findByPk(id);
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || !id.trim()) {
        throw new ApiError(400, "User ID is required");
    }

    if (req.user.id !== id) {
        throw new ApiError(403, "Unauthorized access");
    }
// find by primary key :/
    const user = await users.findByPk(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }
// destroy the user with the provided id 
    await users.destroy({
        where: {
            id: id
        }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User deleted successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id?.trim()) throw new ApiError(400, "User ID is required");
  if (req.user.id !== id) throw new ApiError(403, "Unauthorized access");

  const user = await users.findByPk(id);
  if (!user) throw new ApiError(404, "User not found");

  const {
    name,
    registration_number,
    semester,
    branch,
    hostel,
    graduation_year,
  } = req.body;


  if (!name || !semester || !graduation_year) {
    throw new ApiError(400, "Missing required fields");
  }

// unique registration number only to avoid misuse 
  if (registration_number && registration_number !== user.registration_number) {
    const existingUser = await users.findOne({
      where: { registration_number },
    });
    if (existingUser) {
      throw new ApiError(400, "Registration number already in use");
    }
  }
  // only change the given fields rest keep the sake 
  Object.assign(user, {
    name: name ?? user.name,
    registration_number: registration_number ?? user.registration_number,
    semester: semester ?? user.semester,
    branch: branch ?? user.branch,
    hostel: hostel ?? user.hostel,
    graduation_year: graduation_year ?? user.graduation_year,
  });

  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

export const getAllUser = asyncHandler(async (req, res) => {
    const allUsers = await users.findAll();
    return res
        .status(200)
        .json(new ApiResponse(200, allUsers, "Users fetched successfully"));
});