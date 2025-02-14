import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
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

router.get("/", authMiddleware, getAllSubjects); 
router.get("/:userId", authMiddleware, getUserSubjects); 
router.post("/:userId/add", authMiddleware, addUserSubject); 
router.post("/:userId/remove", authMiddleware, removeUserSubject); 

router.post("/add", authMiddleware, addSubject);
router.put("/:subjectId", authMiddleware, editSubject);
router.delete("/:subjectId", authMiddleware, deleteSubject);

export default router;
