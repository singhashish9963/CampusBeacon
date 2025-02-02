import express from "express";
import {
  signUpUser,
  loginUser,
  forgetPassword,
  getCurrentUser,
  resetPassword,
  emailVerification,
} from "../appwrite/auth.controller.js";
import { deleteUser, getAllUser, getUser, updateUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import emailMiddleware from "../middlewares/email.middleware.js";

const router = express.Router();

router.post("/signup",emailMiddleware, signUpUser);
router.post("/login",emailMiddleware, loginUser);
router.post("/verify-email", emailVerification);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword); 
router.get("/get-user/:id", getUser);
router.delete("/delete-user",deleteUser)
router.get("/get/all/user",getAllUser);


// protected routes
router.get("/current-user",authMiddleware,  getCurrentUser);
router.post("/update-user",authMiddleware, updateUser);

export default router;
