import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import emailMiddleware from "../middlewares/email.middleware.js";
import User from "../models/user.model.js"
import {
  getCurrentUser,
  updateUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  registerUser,
  loginUser,
  googleAuth,
  verifyEmail,
  sendVerificationEmail
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


router.get("/verify-email", verifyEmail); 


router.get("/verify-status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({
      success: true,
      data: {
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check verification status",
    });
  }
});

/*
=======================================================================
        Protected Routes
=======================================================================
*/

router.get("/current", authMiddleware, getCurrentUser);
router.put("/update", authMiddleware, updateUser);
router.post("/logout", authMiddleware, logoutUser);

export default router;
