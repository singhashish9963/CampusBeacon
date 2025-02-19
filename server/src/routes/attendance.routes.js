import express from "express";
import {
  createAttendance,
  getAttendanceById,
  getAllAttendances,
  updateAttendance,
  deleteAttendance,
  createAttendanceStats,
  getAttendanceStatsById,
  getAllAttendanceStats,
  updateAttendanceStats,
  deleteAttendanceStats,
  getStudentAttendanceReport,
  getSubjectAttendanceReport,
  generateAttendanceAlerts,
} from "../controllers/attendance.controller.js";

const router = express.Router();

// Attendance endpoints
router.post("/attendance", createAttendance);
router.get("/attendance", getAllAttendances);
router.get("/attendance/:id", getAttendanceById);
router.put("/attendance/:id", updateAttendance);
router.delete("/attendance/:id", deleteAttendance);

router.get('/report/student/:userId', getStudentAttendanceReport);
router.get('/report/subject/:subjectId', getSubjectAttendanceReport);
router.get('/alerts', generateAttendanceAlerts);

// Attendance statistics endpoints
router.post("/stats", createAttendanceStats);
router.get("/stats", getAllAttendanceStats);
router.get("/stats/:id", getAttendanceStatsById);
router.put("/stats/:id", updateAttendanceStats);
router.delete("/stats/:id", deleteAttendanceStats);

export default router;
