import { UserAttendance, AttendanceStats } from "../models/attendance.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { Op } from "sequelize"; // Add this import
import sequelize from "../db/db.js"; // Add this import

/*
=======================================
  Mark Attendance (User selects Date & Subject)
=======================================
*/
export const markAttendance = asyncHandler(async (req, res) => {
  const { subjectId, date, status } = req.body;
  const userId = req.user.id;

  if (!subjectId || !date || !status) {
    throw new ApiError("Subject, date, and status are required", 400);
  }

  if (!["Present", "Absent", "Cancelled"].includes(status)) {
    throw new ApiError("Invalid status", 400);
  }

  // Use transaction for data consistency
  const transaction = await sequelize.transaction();

  try {
    const existingAttendance = await UserAttendance.findOne({
      where: {
        user_id: userId,
        subject_id: subjectId,
        date,
      },
      transaction,
    });

    if (existingAttendance) {
      throw new ApiError("Attendance already marked for this date", 400);
    }

    await UserAttendance.create(
      {
        user_id: userId,
        subject_id: subjectId,
        date,
        status,
      },
      { transaction }
    );

    let stats = await AttendanceStats.findOne({
      where: {
        user_id: userId,
        subject_id: subjectId,
      },
      transaction,
    });

    if (!stats) {
      stats = await AttendanceStats.create(
        {
          user_id: userId,
          subject_id: subjectId,
          total_classes: 0,
          total_present: 0,
        },
        { transaction }
      );
    }

    if (status !== "Cancelled") {
      stats.total_classes += 1;
      if (status === "Present") {
        stats.total_present += 1;
      }
      await stats.save({ transaction });
    }

    await transaction.commit();

    return res
      .status(201)
      .json(new ApiResponse(201, null, "Attendance marked successfully"));
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

/*
=======================================
  Update Attendance Entry (Change Status)
=======================================
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
      where: {
        id: attendanceId,
        user_id: userId,
      },
      transaction,
    });

    if (!attendance) {
      throw new ApiError("Attendance record not found", 404);
    }

    const stats = await AttendanceStats.findOne({
      where: {
        user_id: userId,
        subject_id: attendance.subject_id,
      },
      transaction,
    });

    // Adjust stats before updating
    if (attendance.status !== "Cancelled") {
      stats.total_classes -= 1;
      if (attendance.status === "Present") {
        stats.total_present -= 1;
      }
    }

    attendance.status = status;
    await attendance.save({ transaction });

    if (status !== "Cancelled") {
      stats.total_classes += 1;
      if (status === "Present") {
        stats.total_present += 1;
      }
    }

    await stats.save({ transaction });
    await transaction.commit();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Attendance updated successfully"));
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
});

/*
=======================================
  Delete Attendance Entry
=======================================
*/
export const deleteAttendance = asyncHandler(async (req, res) => {
  const { attendanceId } = req.params;
  const userId = req.user.id;

  const transaction = await sequelize.transaction();

  try {
    const attendance = await UserAttendance.findOne({
      where: {
        id: attendanceId,
        user_id: userId,
      },
      transaction,
    });

    if (!attendance) {
      throw new ApiError("Attendance record not found", 404);
    }

    const stats = await AttendanceStats.findOne({
      where: {
        user_id: userId,
        subject_id: attendance.subject_id,
      },
      transaction,
    });

    if (attendance.status !== "Cancelled") {
      stats.total_classes -= 1;
      if (attendance.status === "Present") {
        stats.total_present -= 1;
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

/*
=======================================
  Get All Attendance Records for a User & Subject
=======================================
*/
export const getAttendanceRecords = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { subjectId, year, month } = req.params;
  let whereClause = {
    user_id: userId,
    subject_id: subjectId,
  };

  if (year && month) {
    const paddedMonth = month.toString().padStart(2, "0");
    const lastDay = new Date(year, month, 0).getDate();
    whereClause.date = {
      [Op.between]: [
        `${year}-${paddedMonth}-01`,
        `${year}-${paddedMonth}-${lastDay}`,
      ],
    };
  }

  const records = await UserAttendance.findAll({
    where: whereClause,
    attributes: [
      "id",
      "date",
      "status",
      "created_at",
      "updated_at",
      "user_id",
      "subject_id",
    ],
    order: [["date", "DESC"]],
    raw: true,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, records, "Attendance records retrieved successfully")
    );
});

/*
=======================================
  Get Attendance Percentage
=======================================
*/
export const getAttendancePercentage = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { subjectId } = req.params;

  const stats = await AttendanceStats.findOne({
    where: {
      user_id: userId,
      subject_id: subjectId,
    },
    raw: true,
  });

  if (!stats || stats.total_classes === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { percentage: 0 }, "No attendance recorded yet")
      );
  }

  const percentage = (stats.total_present / stats.total_classes) * 100;
  return res
    .status(200)
    .json(
      new ApiResponse(200, { percentage }, "Attendance percentage calculated")
    );
});

/*
=======================================
  Get Monthly Attendance Report
=======================================
*/
export const getMonthlyReport = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { subjectId, month, year } = req.params;
  const paddedMonth = month.padStart(2, "0");
  const lastDay = new Date(year, month, 0).getDate();

  const records = await UserAttendance.findAll({
    where: {
      user_id: userId,
      subject_id: subjectId,
      date: {
        [Op.between]: [
          `${year}-${paddedMonth}-01`,
          `${year}-${paddedMonth}-${lastDay}`,
        ],
      },
    },
    order: [["date", "ASC"]],
    raw: true,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        records,
        "Monthly attendance report retrieved successfully"
      )
    );
});
/*
=======================================
  Admin: Get Attendance of Any User
=======================================
*/
export const getUserAttendanceAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const records = await UserAttendance.findAll({
    where: { user_id: userId },
    order: [["date", "DESC"]],
    raw: true,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        records,
        "User attendance records retrieved successfully"
      )
    );
});
