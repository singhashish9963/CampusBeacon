import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import emailMiddleware from "../middlewares/email.middleware.js";
import {
  getCurrentUser,
  updateUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  registerUser,
  loginUser,
  googleAuth,
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/user.controller.js";

const router = express.Router();

/*
=======================================================================
        Public Routes
=======================================================================
*/

router.post("/signup", emailMiddleware, registerUser);
router.post("/login", emailMiddleware, loginUser);


router.post("/google-auth", googleAuth);


router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/send-verification-email", sendVerificationEmail);
router.get("/verify-email", verifyEmail);

/*
=======================================================================
        Protected Routes
=======================================================================
*/

router.get("/current", authMiddleware, getCurrentUser);
router.put("/update", authMiddleware, updateUser);
router.post("/logout", authMiddleware, logoutUser);

export default router;
