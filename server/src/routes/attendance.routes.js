import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  markAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceRecords,
  getAttendancePercentage,
  getMonthlyReport,
  getUserAttendanceAdmin,
} from "../controllers/attendance.controller.js";

const router = express.Router();

// Update the records route to accept year and month parameters
router.get("/records/:subjectId", authMiddleware, getAttendanceRecords);
router.get(
  "/records/:subjectId/:year/:month",
  authMiddleware,
  getAttendanceRecords
);

// ... other routes remain the same
router.post("/mark", authMiddleware, markAttendance);
router.put("/update/:attendanceId", authMiddleware, updateAttendance);
router.delete("/delete/:attendanceId", authMiddleware, deleteAttendance);
router.get("/percentage/:subjectId", authMiddleware, getAttendancePercentage);
router.get("/report/:subjectId/:month/:year", authMiddleware, getMonthlyReport);
router.get("/admin/user/:userId", authMiddleware, getUserAttendanceAdmin);

export default router;
