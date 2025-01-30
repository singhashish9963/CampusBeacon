import users from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createUser = asyncHandler(async (req, res) => {
    const { name, registration_number, semester, branch, hostel, graduation_year } = req.body;

    const newUser = new UserActivation({
        name,
        registration_number,
        semester,
        branch,
        hostel,
        graduation_year,
    });
    
    const savedUser = await newUser.save();
    
    return res
        .status(201)
        .json(new ApiResponse(201, savedUser, "User created successfully"));
});

export const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id || !id.trim()) {
        throw new ApiError(400, "User ID is required");
    }

    if (req.user.id !== id) {
        throw new ApiError(403, "Unauthorized access");
    }

    const user = await UserActivation.findById(id);
    
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

    const user = await users.findByPk(id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await user.destroy();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User deleted successfully"));
});
