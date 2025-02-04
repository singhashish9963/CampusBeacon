import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/emailService.js";


/*
=============================
        Time and Date  
=============================
*/

const getCurrentUTCDateTime = () => {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace("T", " ");
};

/*
=============================
        Register User 
=============================
*/
export const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
// we cannot have same email as registration number are different 
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) return next(new ApiError("User already exists", 400));

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  console.log(`New user registered at ${getCurrentUTCDateTime()}`);

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { userId: newUser.id },
        "User registered successfully"
      )
    );
});

/*
=============================
        Login User 
=============================
*/

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new ApiError("Invalid email or password", 400));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ApiError("Invalid email or password", 400));
  }
// for safety expiry in 1h, user will be logged out if he doesnt generate a token again
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

// save as http cookie for better security 
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict", 
    maxAge: 60 * 60 * 1000, 
  });

  console.log(`User ${email} logged in at ${getCurrentUTCDateTime()}`);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: { id: user.id, email: user.email } },
        "Login successful"
      )
    );
});

/*
==============================
       Get current user 
==============================
*/

export const getCurrentUser = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ApiError("Not authenticated", 401));
  }
// get everything except password for safety 
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res
    .status(200)
    .json(new ApiResponse(200, { user }, "User retrieved successfully"));
});

/*
==============================
       Update User 
==============================
*/

export const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const {
    name,
    registration_number,
    semester,
    branch,
    hostel,
    graduation_year,
  } = req.body;
// find user by id to update that info only
  const user = await User.findByPk(userId);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
// update only the fields that is given 
  if (name !== undefined) user.name = name;
  if (registration_number !== undefined)
    user.registration_number = registration_number;
  if (semester !== undefined) user.semester = semester;
  if (branch !== undefined) user.branch = branch;
  if (hostel !== undefined) user.hostel = hostel;
  if (graduation_year !== undefined) user.graduation_year = graduation_year;

  await user.save();
  console.log(
    `User ${user.email} updated profile at ${getCurrentUTCDateTime()}`
  );

  res
    .status(200)
    .json(new ApiResponse(200, { user }, "User updated successfully"));
});

/*
==============================
       forget Password 
==============================
*/

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
// given inside url for verification
  const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `Please click on the following link to reset your password: ${resetUrl}. This link will expire in 15 minutes.`,
      html: `
                <h1>Password Reset Request</h1>
                <p>Please click on the following link to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 15 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `,
    });

    console.log(
      `Password reset requested for ${email} at ${getCurrentUTCDateTime()}`
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, null, "Password reset instructions sent to email")
      );
  } catch (error) {
    return next(new ApiError("Error sending reset email", 500));
  }
});

/*
==============================
       reset Password 
==============================
*/

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token) {
    return next(new ApiError("Reset token is required", 400));
  }
// contains payload after jwt is verified 
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new ApiError("Invalid or expired token", 400));
  }

  const user = await User.findByPk(decoded.id);
  if (!user) {
    return next(new ApiError("User not found", 404));
  }
// method to compare hashed password 
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  console.log(
    `Password reset completed for ${user.email} at ${getCurrentUTCDateTime()}`
  );

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Changed Successfully",
      text: "Your password has been changed successfully. If you did not make this change, please contact support immediately.",
      html: `
                <h1>Password Changed Successfully</h1>
                <p>Your password has been changed successfully.</p>
                <p>If you did not make this change, please contact support immediately.</p>
            `,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }

  res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});

/*
==============================
       logout User 
==============================
*/

export const logoutUser = asyncHandler(async (req, res, next) => {

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  console.log(
    `User ${req.user.email} logged out at ${getCurrentUTCDateTime()}`
  );

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});