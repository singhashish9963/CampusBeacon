import express from "express";
import {
  signUpUser,
  loginUser,
  forgetPassword,
  getCurrentUser,
  resetPassword,
} from "../appwrite/auth.controller.js";
import { createUser,deleteUser,getUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/user.middleware.js";
import emailMiddleware from "../middlewares/email.middleware.js";

const router = express.Router();

router.post("/signup",emailMiddleware, signUpUser);
router.post("/login",emailMiddleware, loginUser);
// router.post("/verify-email", emailVerification);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword); 
router.get("/get-user",getUser)
router.post("/create-user",createUser)
router.delete("/delete-user",deleteUser)


router.get("/current-user", authMiddleware, getCurrentUser);

export default router;
