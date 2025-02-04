import express from "express"
import authMiddleware from "../middlewares/auth.middleware.js"
import {
  getCurrentUser,
  updateUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  registerUser,
  loginUser,
} from "../controllers/user.controller.js";


const router=express.Router();
router.post("/signup",registerUser)
router.post("/login",loginUser)
router.get("/current", authMiddleware, getCurrentUser);
router.put("/update", authMiddleware, updateUser);
router.post("/logout", authMiddleware, logoutUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;