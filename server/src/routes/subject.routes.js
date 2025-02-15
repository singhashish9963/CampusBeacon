import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getAllSubjects,
  getUserSubjects,
  addUserSubject,
  removeUserSubject,
  addSubject,
  editSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";

const router = express.Router();

// Fix routes to match controller documentation
router.get("/", getAllSubjects); // GET /api/subjects (Public route - removed authMiddleware)
router.get("/user/:userId", authMiddleware, getUserSubjects); // GET /api/subjects/user/:userId
router.post("/user/:userId/add", authMiddleware, addUserSubject); // POST /api/subjects/user/:userId/add
router.delete("/user/:userId/remove", authMiddleware, removeUserSubject); // Changed to DELETE method
router.post("/", authMiddleware, addSubject); // POST /api/subjects
router.put("/:subjectId", authMiddleware, editSubject); // PUT /api/subjects/:subjectId
router.delete("/:subjectId", authMiddleware, deleteSubject); // DELETE /api/subjects/:subjectId

export default router;
