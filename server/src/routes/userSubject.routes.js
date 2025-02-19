import express from "express";
import {
  createUserSubject,
  getUserSubjectById,
  getAllUserSubjects,
  updateUserSubject,
  deleteUserSubject,
} from "../controllers/subject.controller.js";

const router = express.Router();

// Create new user subject assignment (assign a subject to a user)
router.post("/", createUserSubject);

// Get all user subject assignments
router.get("/", getAllUserSubjects);

// Get a specific user subject assignment by ID
router.get("/:id", getUserSubjectById);

// Update a user subject assignment by ID
router.put("/:id", updateUserSubject);

// Delete a user subject assignment by ID
router.delete("/:id", deleteUserSubject);

export default router;
