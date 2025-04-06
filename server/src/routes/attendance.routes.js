import express from "express";
import {
  markAttendance,
  updateAttendance,
  getAttendanceRecords,
  getAttendancePercentage,
  getOverallAttendancePercentage,
  getSubjectWisePercentages,
} from "../controllers/attendance.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, markAttendance);
router.put("/:recordId", authMiddleware, updateAttendance);
router.get("/", authMiddleware, getAttendanceRecords);
router.get("/percentage", authMiddleware, getAttendancePercentage);
router.get("/percentage/overall", authMiddleware, getOverallAttendancePercentage);
router.get("/percentage/subject-wise", authMiddleware, getSubjectWisePercentages);

export default router;
