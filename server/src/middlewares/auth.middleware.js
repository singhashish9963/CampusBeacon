import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";

export const authMiddleware = (req, res, next) => {
  try {
 
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError("No token provided", 401);
    }

   
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new ApiError("Invalid token format", 401);
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(error.message || "Authentication failed", 401));
  }
};

export default authMiddleware;
