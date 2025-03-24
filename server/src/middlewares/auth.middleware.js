import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/*
=======================================================================
        Auth Middleware for checking and storing user auth info
=======================================================================
*/
export const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    throw new ApiError("Not authenticated. Please log in.", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError("Session expired. Please log in again.", 401);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError("Invalid token. Please log in again.", 401);
    }
    throw new ApiError("Authentication failed. Please log in again.", 401);
  }
});

export default authMiddleware;
