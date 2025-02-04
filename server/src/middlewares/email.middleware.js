import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/*
================================================================
        To ensure only mnnit students are able to login   
================================================================
*/

const emailMiddleware = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    if (!email.toLowerCase().endsWith('@mnnit.ac.in')) {
        throw new ApiError(403, "Access denied. Only MNNIT students can access this service");
    }

    req.validatedEmail = email.toLowerCase();
    next();
});

export default emailMiddleware;
