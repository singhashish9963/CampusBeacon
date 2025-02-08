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

  // It is important to ensure process.env.JWT_SECRET is defined otherwise this will throw.
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded;
  next();
});

export default authMiddleware;
