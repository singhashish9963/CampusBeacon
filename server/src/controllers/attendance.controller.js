import { UserAttendance, AttendanceStats } from "../models/attendance.model.js";

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
