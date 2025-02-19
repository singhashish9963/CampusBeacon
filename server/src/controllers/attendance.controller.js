import { UserAttendance, AttendanceStats } from "../models/attendance.model.js";
import Subject from "../models/subject.model.js";
import User from "../models/user.model.js";
import { Op } from "sequelize";
import sequelize from "../db/db.js";

// Constants for attendance thresholds
const ATTENDANCE_THRESHOLD = 75; // Required attendance percentage
const WARNING_THRESHOLD = 80; // Threshold for warning alerts

// Get detailed attendance report for a specific student
export const getStudentAttendanceReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Build date filter if provided
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Get attendance records for all subjects
    const attendanceData = await UserAttendance.findAll({
      where: {
        userId,
        ...dateFilter,
      },
      include: [
        {
          model: Subject,
          attributes: ["name", "code"],
        },
      ],
      order: [["date", "DESC"]],
    });

    // Calculate statistics per subject
    const subjectStats = {};
    attendanceData.forEach((record) => {
      const subjectId = record.subjectId;
      if (!subjectStats[subjectId]) {
        subjectStats[subjectId] = {
          subjectName: record.Subject.name,
          subjectCode: record.Subject.code,
          totalClasses: 0,
          totalPresent: 0,
          attendancePercentage: 0,
          lastAttendance: null,
          atRisk: false,
        };
      }

      subjectStats[subjectId].totalClasses++;
      if (record.status === "Present") {
        subjectStats[subjectId].totalPresent++;
      }
      if (
        !subjectStats[subjectId].lastAttendance ||
        record.date > subjectStats[subjectId].lastAttendance
      ) {
        subjectStats[subjectId].lastAttendance = record.date;
      }
    });

    // Calculate percentages and risk status
    Object.values(subjectStats).forEach((stats) => {
      stats.attendancePercentage =
        (stats.totalPresent / stats.totalClasses) * 100;
      stats.atRisk = stats.attendancePercentage < WARNING_THRESHOLD;
    });

    // Calculate overall statistics
    const overallStats = {
      totalClasses: Object.values(subjectStats).reduce(
        (sum, { totalClasses }) => sum + totalClasses,
        0
      ),
      totalPresent: Object.values(subjectStats).reduce(
        (sum, { totalPresent }) => sum + totalPresent,
        0
      ),
      overallPercentage: 0,
      subjectsAtRisk: Object.values(subjectStats).filter(
        (stats) => stats.atRisk
      ).length,
    };

    overallStats.overallPercentage =
      (overallStats.totalPresent / overallStats.totalClasses) * 100;

    res.status(200).json({
      message: "Student attendance report generated successfully",
      data: {
        studentInfo: {
          id: user.id,
          name: user.name,
          registrationNumber: user.registration_number,
        },
        overallStats,
        subjectWiseStats: subjectStats,
        attendanceRecords: attendanceData,
      },
    });
  } catch (error) {
    console.error("Error generating student attendance report:", error);
    res.status(500).json({
      message: "An error occurred while generating the attendance report",
      error: error.message,
    });
  }
};

// Get attendance report for a specific subject
export const getSubjectAttendanceReport = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    // Build date filter if provided
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Get attendance records with user information
    const attendanceData = await UserAttendance.findAll({
      where: {
        subjectId,
        ...dateFilter,
      },
      include: [
        {
          model: User,
          attributes: ["id", "name", "registration_number"],
        },
      ],
      order: [
        ["userId", "ASC"],
        ["date", "DESC"],
      ],
    });

    // Calculate statistics per student
    const studentStats = {};
    attendanceData.forEach((record) => {
      const userId = record.userId;
      if (!studentStats[userId]) {
        studentStats[userId] = {
          studentInfo: {
            id: record.User.id,
            name: record.User.name,
            registrationNumber: record.User.registration_number,
          },
          totalClasses: 0,
          totalPresent: 0,
          attendancePercentage: 0,
          lastAttendance: null,
          atRisk: false,
        };
      }

      studentStats[userId].totalClasses++;
      if (record.status === "Present") {
        studentStats[userId].totalPresent++;
      }
      if (
        !studentStats[userId].lastAttendance ||
        record.date > studentStats[userId].lastAttendance
      ) {
        studentStats[userId].lastAttendance = record.date;
      }
    });

    // Calculate percentages and identify at-risk students
    Object.values(studentStats).forEach((stats) => {
      stats.attendancePercentage =
        (stats.totalPresent / stats.totalClasses) * 100;
      stats.atRisk = stats.attendancePercentage < WARNING_THRESHOLD;
    });

    // Generate alerts for students below threshold
    const alerts = Object.values(studentStats)
      .filter((stats) => stats.atRisk)
      .map((stats) => ({
        studentName: stats.studentInfo.name,
        registrationNumber: stats.studentInfo.registrationNumber,
        currentPercentage: stats.attendancePercentage.toFixed(2),
        requiredClasses: calculateRequiredClasses(
          stats.totalPresent,
          stats.totalClasses
        ),
      }));

    res.status(200).json({
      message: "Subject attendance report generated successfully",
      data: {
        subjectInfo: {
          id: subject.id,
          name: subject.name,
          code: subject.code,
        },
        overallStats: {
          totalStudents: Object.keys(studentStats).length,
          studentsAtRisk: alerts.length,
          averageAttendance: calculateAverageAttendance(studentStats),
        },
        studentWiseStats: studentStats,
        alerts: alerts,
      },
    });
  } catch (error) {
    console.error("Error generating subject attendance report:", error);
    res.status(500).json({
      message:
        "An error occurred while generating the subject attendance report",
      error: error.message,
    });
  }
};

// Calculate required classes to reach threshold
function calculateRequiredClasses(present, total) {
  const currentPercentage = (present / total) * 100;
  if (currentPercentage >= ATTENDANCE_THRESHOLD) return 0;

  let requiredClasses = 0;
  let newTotal = total;
  let newPresent = present;

  while ((newPresent / newTotal) * 100 < ATTENDANCE_THRESHOLD) {
    newPresent++;
    newTotal++;
    requiredClasses++;
  }

  return requiredClasses;
}

// Calculate average attendance for a subject
function calculateAverageAttendance(studentStats) {
  const totalPercentages = Object.values(studentStats).reduce(
    (sum, stats) => sum + stats.attendancePercentage,
    0
  );
  return totalPercentages / Object.keys(studentStats).length;
}

// Generate attendance alerts
export const generateAttendanceAlerts = async (req, res) => {
  try {
    const alerts = await UserAttendance.findAll({
      attributes: [
        "userId",
        "subjectId",
        [sequelize.fn("COUNT", sequelize.col("id")), "totalClasses"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN status = 'Present' THEN 1 ELSE 0 END")
          ),
          "totalPresent",
        ],
      ],
      include: [
        {
          model: User,
          attributes: ["name", "registration_number", "email"],
        },
        {
          model: Subject,
          attributes: ["name", "code"],
        },
      ],
      group: ["userId", "subjectId", "User.id", "Subject.id"],
      having: sequelize.literal(
        `(SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) < ${WARNING_THRESHOLD}`
      ),
    });

    const formattedAlerts = alerts.map((alert) => ({
      student: {
        name: alert.User.name,
        registrationNumber: alert.User.registration_number,
        email: alert.User.email,
      },
      subject: {
        name: alert.Subject.name,
        code: alert.Subject.code,
      },
      attendance: {
        percentage: (
          (alert.dataValues.totalPresent / alert.dataValues.totalClasses) *
          100
        ).toFixed(2),
        totalClasses: parseInt(alert.dataValues.totalClasses),
        totalPresent: parseInt(alert.dataValues.totalPresent),
        requiredClasses: calculateRequiredClasses(
          parseInt(alert.dataValues.totalPresent),
          parseInt(alert.dataValues.totalClasses)
        ),
      },
    }));

    res.status(200).json({
      message: "Attendance alerts generated successfully",
      data: {
        totalAlerts: formattedAlerts.length,
        alerts: formattedAlerts,
      },
    });
  } catch (error) {
    console.error("Error generating attendance alerts:", error);
    res.status(500).json({
      message: "An error occurred while generating attendance alerts",
      error: error.message,
    });
  }
};
// ----------------------
// User Attendance CRUD
// ----------------------

// Create a new attendance record
export const createAttendance = async (req, res) => {
  try {
    const { userId, subjectId, date, status } = req.body;
    if (!userId || !subjectId || !date || !status) {
      return res.status(400).json({
        message: "userId, subjectId, date, and status are required",
      });
    }

    const attendance = await UserAttendance.create({
      userId: userId,
      subjectId: subjectId,
      date,
      status,
    });

    res.status(201).json({
      message: "Attendance record created successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Error creating attendance record:", error);
    res.status(500).json({
      message: "An error occurred while creating the attendance record",
      error: error.message,
    });
  }
};

// Get attendance record by ID
export const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await UserAttendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }
    res.status(200).json({
      message: "Attendance record retrieved successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Error retrieving attendance record:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the attendance record",
      error: error.message,
    });
  }
};

// Get all attendance records
export const getAllAttendances = async (req, res) => {
  try {
    const attendances = await UserAttendance.findAll();
    res.status(200).json({
      message: "Attendance records retrieved successfully",
      data: attendances,
    });
  } catch (error) {
    console.error("Error retrieving attendance records:", error);
    res.status(500).json({
      message: "An error occurred while retrieving attendance records",
      error: error.message,
    });
  }
};

// Update an attendance record by ID
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, subjectId, date, status } = req.body;

    const attendance = await UserAttendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    attendance.userId = userId !== undefined ? userId : attendance.userId;
    attendance.subjectId =
      subjectId !== undefined ? subjectId : attendance.subjectId;
    attendance.date = date !== undefined ? date : attendance.date;
    attendance.status = status !== undefined ? status : attendance.status;

    await attendance.save();

    res.status(200).json({
      message: "Attendance record updated successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Error updating attendance record:", error);
    res.status(500).json({
      message: "An error occurred while updating the attendance record",
      error: error.message,
    });
  }
};

// Delete an attendance record by ID
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const attendance = await UserAttendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }
    await attendance.destroy();
    res.status(200).json({
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    res.status(500).json({
      message: "An error occurred while deleting the attendance record",
      error: error.message,
    });
  }
};

// --------------------------
// Attendance Stats CRUD
// --------------------------

// Create attendance statistics for a user & subject
export const createAttendanceStats = async (req, res) => {
  try {
    const { userId, subjectId, totalClasses, totalPresent } = req.body;
    if (!userId || !subjectId) {
      return res.status(400).json({
        message: "userId and subjectId are required",
      });
    }
    const stats = await AttendanceStats.create({
      userId: userId,
      subjectId: subjectId,
      totalClasses: totalClasses || 0,
      totalPresent: totalPresent || 0,
    });

    res.status(201).json({
      message: "Attendance statistics created successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error creating attendance statistics:", error);
    res.status(500).json({
      message: "An error occurred while creating the attendance statistics",
      error: error.message,
    });
  }
};

// Get attendance statistics by ID
// If no stats record is found, default statistics are returned.
export const getAttendanceStatsById = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await AttendanceStats.findByPk(id);
    if (!stats) {
      return res.status(200).json({
        message:
          "Attendance statistics not found. Returning default statistics.",
        data: {
          userId: null,
          subjectId: id,
          totalClasses: 0,
          totalPresent: 0,
          percentage: 0,
          formattedPercentage: "0.00%",
          isAtRisk: true,
          needsImprovement: true,
        },
      });
    }
    res.status(200).json({
      message: "Attendance statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error retrieving attendance statistics:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the attendance statistics",
      error: error.message,
    });
  }
};

// Get all attendance statistics
export const getAllAttendanceStats = async (req, res) => {
  try {
    const stats = await AttendanceStats.findAll();
    res.status(200).json({
      message: "Attendance statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error retrieving attendance statistics:", error);
    res.status(500).json({
      message: "An error occurred while retrieving attendance statistics",
      error: error.message,
    });
  }
};

// Update attendance statistics by ID
export const updateAttendanceStats = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, subjectId, totalClasses, totalPresent } = req.body;

    const stats = await AttendanceStats.findByPk(id);
    if (!stats) {
      return res.status(404).json({
        message: "Attendance statistics not found",
      });
    }

    stats.userId = userId !== undefined ? userId : stats.userId;
    stats.subjectId = subjectId !== undefined ? subjectId : stats.subjectId;
    stats.totalClasses =
      totalClasses !== undefined ? totalClasses : stats.totalClasses;
    stats.totalPresent =
      totalPresent !== undefined ? totalPresent : stats.totalPresent;

    await stats.save();

    res.status(200).json({
      message: "Attendance statistics updated successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error updating attendance statistics:", error);
    res.status(500).json({
      message: "An error occurred while updating the attendance statistics",
      error: error.message,
    });
  }
};

// Delete attendance statistics by ID
export const deleteAttendanceStats = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await AttendanceStats.findByPk(id);
    if (!stats) {
      return res.status(404).json({
        message: "Attendance statistics not found",
      });
    }
    await stats.destroy();
    res.status(200).json({
      message: "Attendance statistics deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting attendance statistics:", error);
    res.status(500).json({
      message: "An error occurred while deleting the attendance statistics",
      error: error.message,
    });
  }
};
