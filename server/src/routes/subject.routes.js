import express from "express";
import {
  createSubject,
  getSubjectById,
  getAllSubjects,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";

const router = express.Router();

// Create a new subject
router.post("/", createSubject);

// Get all subjects
router.get("/", getAllSubjects);

// Get subject by ID
router.get("/:id", getSubjectById);

// Update subject by ID
router.put("/:id", updateSubject);

// Delete subject by ID
router.delete("/:id", deleteSubject);

export default router;
