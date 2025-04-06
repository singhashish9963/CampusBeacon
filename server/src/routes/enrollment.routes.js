import express from "express";
import {
  enrollUserInSubject,
  unenrollUserFromSubject,
  getUserEnrollments,
  getSubjectEnrollments,
} from "../controllers/user_subject.controller.js"; 
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, enrollUserInSubject);

router.delete("/", authMiddleware, unenrollUserFromSubject);

router.get("/users/:userId/enrollments", authMiddleware, getUserEnrollments);

router.get("/subjects/:subjectId/enrollments", authMiddleware, getSubjectEnrollments);

export default router;
