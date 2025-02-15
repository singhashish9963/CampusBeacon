import { UserAttendance, AttendanceStats } from "../models/attendance.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { Op } from "sequelize";
import sequelize from "../db/db.js";
import { Subject } from "../models/subject.model.js";

/**
 * @desc    Mark attendance for a subject
 * @route   POST /api/attendance
 * @access  Private
 */
export const markAttendance = asyncHandler(async (req, res) => {
  const { subjectId, date, status } = req.body;
  const userId = req.user.id;

  if (!subjectId || !date || !status) {
    throw new ApiError("Subject ID, date, and status are required", 400);
  }

  if (!["Present", "Absent", "Cancelled"].includes(status)) {
    throw new ApiError(
      "Invalid status. Must be Present, Absent, or Cancelled",
      400
    );
  }

  const transaction = await sequelize.transaction();

  try {
    // Check if attendance already exists
    const existingAttendance = await UserAttendance.findOne({
      where: { userId, subjectId, date },
      transaction,
    });

    if (existingAttendance) {
      throw new ApiError("Attendance already marked for this date", 400);
    }

    // Create attendance record
    const attendance = await UserAttendance.create(
      {
        userId,
        subjectId,
        date,
        status,
      },
      { transaction }
    );

    // Update stats if needed
    if (status !== "Cancelled") {
      const [stats] = await AttendanceStats.findOrCreate({
        where: { userId, subjectId },
        defaults: { totalClasses: 0, totalPresent: 0 },
        transaction,
      });

      stats.totalClasses += 1;
      if (status === "Present") {
        stats.totalPresent += 1;
      }
      await stats.save({ transaction });
    }

    await transaction.commit();
    return res
      .status(201)
      .json(new ApiResponse(201, attendance, "Attendance marked successfully"));
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

/**
 * @desc    Update attendance entry
 * @route   PUT /api/attendance/:attendanceId
 * @access  Private
 */
export const updateAttendance = asyncHandler(async (req, res) => {
  const { attendanceId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  if (!["Present", "Absent", "Cancelled"].includes(status)) {
    throw new ApiError("Invalid status", 400);
  }

  const transaction = await sequelize.transaction();

  try {
    const attendance = await UserAttendance.findOne({
      where: { id: attendanceId, userId },
      transaction,
    });

    if (!attendance) {
      throw new ApiError("Attendance record not found", 404);
    }

    const oldStatus = attendance.status;
    const stats = await AttendanceStats.findOne({
      where: { userId, subjectId: attendance.subjectId },
      transaction,
    });

    // Update stats based on status change
    if (oldStatus !== "Cancelled") {
      stats.totalClasses -= 1;
      if (oldStatus === "Present") {
        stats.totalPresent -= 1;
      }
    }

    if (status !== "Cancelled") {
      stats.totalClasses += 1;
      if (status === "Present") {
        stats.totalPresent += 1;
      }
    }

    attendance.status = status;
    await Promise.all([
      attendance.save({ transaction }),
      stats.save({ transaction }),
    ]);

    await transaction.commit();
    return res
      .status(200)
      .json(
        new ApiResponse(200, attendance, "Attendance updated successfully")
      );
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

/**
 * @desc    Get attendance records for a subject
 * @route   GET /api/attendance/:subjectId/:year/:month
 * @access  Private
 */
export const getAttendanceRecords = asyncHandler(async (req, res) => {
  const { subjectId, year, month } = req.params;
  const userId = req.user.id;

  let whereClause = { userId, subjectId };

  if (year && month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    whereClause.date = {
      [Op.between]: [startDate, endDate],
    };
  }

  const records = await UserAttendance.findAll({
    where: whereClause,
    include: [
      {
        model: Subject,
        attributes: ["name", "code"],
      },
    ],
    order: [["date", "DESC"]],
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, records, "Attendance records retrieved successfully")
    );
});

/**
 * @desc    Get attendance percentage for a subject
 * @route   GET /api/attendance/stats/:subjectId
 * @access  Private
 */
export const getAttendanceStats = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const userId = req.user.id;

  const stats = await AttendanceStats.findOne({
    where: { userId, subjectId },
    include: [
      {
        model: Subject,
        attributes: ["name", "code"],
      },
    ],
  });

  if (!stats || stats.totalClasses === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          percentage: 0,
          totalClasses: 0,
          totalPresent: 0,
        },
        "No attendance recorded"
      )
    );
  }

  const percentage = ((stats.totalPresent / stats.totalClasses) * 100).toFixed(
    2
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        percentage: parseFloat(percentage),
        totalClasses: stats.totalClasses,
        totalPresent: stats.totalPresent,
        subject: stats.subject,
      },
      "Attendance statistics retrieved successfully"
    )
  );
});

/**
 * @desc    Delete attendance record
 * @route   DELETE /api/attendance/:attendanceId
 * @access  Private
 */
export const deleteAttendance = asyncHandler(async (req, res) => {
  const { attendanceId } = req.params;
  const userId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    const attendance = await UserAttendance.findOne({
      where: { id: attendanceId, userId },
      transaction,
    });

    if (!attendance) {
      throw new ApiError("Attendance record not found", 404);
    }

    if (attendance.status !== "Cancelled") {
      const stats = await AttendanceStats.findOne({
        where: { userId, subjectId: attendance.subjectId },
        transaction,
      });

      stats.totalClasses -= 1;
      if (attendance.status === "Present") {
        stats.totalPresent -= 1;
      }
      await stats.save({ transaction });
    }

    await attendance.destroy({ transaction });
    await transaction.commit();

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "Attendance record deleted successfully")
      );
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});
