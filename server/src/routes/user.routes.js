import express from "express";
import {
  signUpUser,
  loginUser,
  forgetPassword,
  getCurrentUser,
  emailVerification,
  resetPassword,
} from "../appwrite/auth.controller.js";
import authMiddleware from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/verify-email", emailVerification);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword); 

router.get("/current-user", authMiddleware, getCurrentUser);

export default router;
