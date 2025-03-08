import express from "express";
import {
  createUserSubject,
  getUserSubjectById,
  getUserSubjectsByUserId,
  getAllUserSubjects,
  updateUserSubject,
  deleteUserSubjectAssignment,
} from "../controllers/subject.controller.js";

const router = express.Router();

// Create new user subject assignment (assign a subject to a user)
router.post("/", createUserSubject);

// Get all user subject assignments
router.get("/", getAllUserSubjects);

// NEW: Get all user subject assignments for a specific user
router.get("/user/:userId", getUserSubjectsByUserId);

// Get a specific user subject assignment by its primary key ID
router.get("/:id", getUserSubjectById);

// Update a user subject assignment by its primary key ID
router.put("/:id", updateUserSubject);

// NEW: Delete a user subject assignment (using userId and subjectId)
router.delete("/:userId/:subjectId", deleteUserSubjectAssignment);

export default router;
