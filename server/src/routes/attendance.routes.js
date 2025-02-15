import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  markAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceRecords,
  getAttendanceStats,
} from "../controllers/attendance.controller.js";

const router = express.Router();

// Fix routes to match controller documentation
router.post("/", authMiddleware, markAttendance); // POST /api/attendance
router.put("/:attendanceId", authMiddleware, updateAttendance); // PUT /api/attendance/:attendanceId
router.get("/:subjectId/:year/:month", authMiddleware, getAttendanceRecords); // GET /api/attendance/:subjectId/:year/:month
router.get("/stats/:subjectId", authMiddleware, getAttendanceStats); // GET /api/attendance/stats/:subjectId
router.delete("/:attendanceId", authMiddleware, deleteAttendance); // DELETE /api/attendance/:attendanceId

export default router;
