import { Client, ID, Account } from "appwrite";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const client =
  new Client()
    .setProject(process.env.APPWRITE_PROJECT_ID || "679a6e2d0021917d3cba")
    .setEndpoint(process.env.APPWRITE_ENDPOINT ||
  "https://cloud.appwrite.io/v1");

const account = new Account(client);

const signUpUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        throw new ApiError(400, "All fields are required");
    }

    const signedUp = await account.create(ID.unique(), email, password);
    return res
        .status(201)
        .json(new ApiResponse(201, signedUp, "Account created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
        throw new ApiError(400, "Email and password are required");
    }

    const session = await account.createEmailSession(email, password);
    return res
        .status(200)
        .json(new ApiResponse(200, session, "Login successful"));
});

const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email?.trim()) {
        throw new ApiError(400, "Email is required");
    }

    const recovery = await account.createRecovery(email, "http://localhost:5173/reset-password");
    return res
        .status(200)
        .json(new ApiResponse(200, recovery, "Password recovery email sent"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const currentUser = await account.get();
    return res
        .status(200)
        .json(new ApiResponse(200, currentUser, "Current user fetched successfully"));
});

const loginGoogle = asyncHandler(async (req, res) => {
    const session = await account.createOAuth2Session(
        "google",
        "http://localhost:5173/",
        "http://localhost:5173/auth/failed"
    );
    return res
        .status(200)
        .json(new ApiResponse(200, session, "Google login successful"));
});

const resetPassword = asyncHandler(async (req, res) => {
    const { userId, secret, password } = req.body;

    if (!userId || !secret || !password) {
        throw new ApiError(400, "Missing required fields");
    }

    const result = await account.updateRecovery(userId, secret, password);
    return res
        .status(200)
        .json(new ApiResponse(200, result, "Password reset successful"));
});

export {
    signUpUser,
    loginUser,
    forgetPassword,
    getCurrentUser,
    loginGoogle,
    resetPassword
};
