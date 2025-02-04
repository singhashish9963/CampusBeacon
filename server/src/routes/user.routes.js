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
import emailMiddleware from "../middlewares/email.middleware.js"

/*
=======================================================================
        Email middleware to ensure only mnnit students can login  
=======================================================================
*/

const router=express.Router();
router.post("/signup",emailMiddleware,registerUser)
router.post("/login",emailMiddleware,loginUser)

/*
===============================
        Protected Routes   
===============================
*/

router.get("/current", authMiddleware, getCurrentUser);
router.put("/update", authMiddleware, updateUser);
router.post("/logout", authMiddleware, logoutUser);

/*
=============================
       Public Routes   
=============================
*/

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;