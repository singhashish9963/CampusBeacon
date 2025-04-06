import {
  User,
  Subject,
  UserSubject,
  AttendanceRecord,
} from "../models/association.js";
import { Op } from "sequelize";
import sequelize from "../db/db.js";

const handleError = (res, error, message = "An unexpected error occurred", statusCode = 500) => {
  console.error(`Error in AttendanceController: ${message}`, error);
  const clientMessage =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal Server Error"
      : error.message || message;

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
    ...(process.env.NODE_ENV !== "production" && { errorType: error.name }),
  });
};

const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (typeof dateString !== "string" || !dateString.match(regex)) return false;
  const date = new Date(dateString + "T00:00:00Z");
  const timestamp = date.getTime();
  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) return false;
  return date.toISOString().startsWith(dateString);
};

export const markAttendance = async (req, res) => {
  const { userId, subjectId, date, status } = req.body;

  if (userId == null || subjectId == null || !date || !status) {
    return res.status(400).json({
      success: false,
      message: "userId, subjectId, date, and status are required.",
    });
  }
  if (!["Present", "Absent"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be 'Present' or 'Absent'.",
    });
  }
  if (!isValidDate(date)) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format. Use YYYY-MM-DD.",
    });
  }
  const numUserId = parseInt(userId, 10);
  const numSubjectId = parseInt(subjectId, 10);
  if (isNaN(numUserId) || isNaN(numSubjectId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid userId or subjectId." });
  }

  try {
    const enrollment = await UserSubject.findOne({
      where: { userId: numUserId, subjectId: numSubjectId },
    });
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "User is not enrolled in this subject.",
      });
    }

    const [record, created] = await AttendanceRecord.findOrCreate({
      where: { userId: numUserId, subjectId: numSubjectId, date },
      defaults: { status, markedAt: new Date() },
    });

    if (!created) {
      return res.status(409).json({
        success: false,
        message:
          "Attendance already recorded for this date. Use the edit (PUT) function to update.",
      });
    }

    const recordWithSubject = await AttendanceRecord.findByPk(record.id, {
      include: [
        { model: Subject, as: "subject", attributes: ["name", "code"] },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully.",
      data: recordWithSubject || record,
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Attendance already recorded (concurrent request issue).",
      });
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Invalid User or Subject ID provided.",
      });
    }
    handleError(res, error, "Failed to mark attendance.");
  }
};

export const updateAttendance = async (req, res) => {
  const { recordId } = req.params;
  const { status } = req.body;
  const numRecordId = parseInt(recordId, 10);

  if (!status || !["Present", "Absent"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Valid status ('Present' or 'Absent') is required.",
    });
  }
  if (isNaN(numRecordId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid record ID." });
  }

  try {
    const record = await AttendanceRecord.findByPk(numRecordId);
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance record not found." });
    }

    if (record.status !== status) {
      record.status = status;
      record.markedAt = new Date();
      await record.save();
    } else {
      return res.status(200).json({
        success: true,
        message: "Attendance status is already set to the requested value.",
        data: record,
      });
    }

    const updatedRecordWithSubject = await AttendanceRecord.findByPk(
      record.id,
      {
        include: [
          { model: Subject, as: "subject", attributes: ["name", "code"] },
        ],
      }
    );

    res.status(200).json({
      success: true,
      message: "Attendance record updated successfully.",
      data: updatedRecordWithSubject || record,
    });
  } catch (error) {
    handleError(res, error, "Failed to update attendance record.");
  }
};

export const getAttendanceRecords = async (req, res) => {
  const { userId, subjectId, date, startDate, endDate } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId query parameter is required." });
  }

  const numUserId = parseInt(userId, 10);
  if (isNaN(numUserId)) {
    return res.status(400).json({ success: false, message: "Invalid userId." });
  }

  try {
    const whereClause = { userId: numUserId };

    if (subjectId) {
      const numSubjectId = parseInt(subjectId, 10);
      if (isNaN(numSubjectId)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid subjectId." });
      }
      whereClause.subjectId = numSubjectId;
    }

    if (date && isValidDate(date)) {
      whereClause.date = date;
    } else {
      const dateRangeFilter = {};
      if (startDate && isValidDate(startDate))
        dateRangeFilter[Op.gte] = startDate;
      if (endDate && isValidDate(endDate)) dateRangeFilter[Op.lte] = endDate;
      if (Object.keys(dateRangeFilter).length > 0)
        whereClause.date = dateRangeFilter;
    }

    const records = await AttendanceRecord.findAll({
      where: whereClause,
      include: [
        { model: Subject, as: "subject", attributes: ["id", "name", "code"] },
      ],
      order: [
        ["date", "ASC"],
        ["markedAt", "ASC"],
      ],
    });

    res
      .status(200)
      .json({ success: true, count: records.length, data: records });
  } catch (error) {
    handleError(res, error, "Failed to retrieve attendance records.");
  }
};

export const getAttendancePercentage = async (req, res) => {
  const { userId, subjectId } = req.query;

  if (!userId || !subjectId) {
    return res.status(400).json({
      success: false,
      message: "userId and subjectId query parameters are required.",
    });
  }
  const numUserId = parseInt(userId, 10);
  const numSubjectId = parseInt(subjectId, 10);
  if (isNaN(numUserId) || isNaN(numSubjectId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid userId or subjectId." });
  }

  try {
    const enrollment = await UserSubject.findOne({
      where: { userId: numUserId, subjectId: numSubjectId },
    });
    if (!enrollment) {
      return res.status(200).json({
        success: true,
        message: "User is not enrolled in this subject or no attendance marked.",
        data: {
          userId: numUserId,
          subjectId: numSubjectId,
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          percentage: 0,
        },
      });
    }

    const result = await AttendanceRecord.findOne({
      where: { userId: numUserId, subjectId: numSubjectId },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalDays"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN status = 'Present' THEN 1 ELSE 0 END")
          ),
          "presentDays",
        ],
      ],
      raw: true,
    });

    const totalDays = parseInt(result.totalDays || 0);
    const presentDays = parseInt(result.presentDays || 0);
    const absentDays = totalDays - presentDays;
    const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        userId: numUserId,
        subjectId: numSubjectId,
        totalDays,
        presentDays,
        absentDays,
        percentage: parseFloat(percentage.toFixed(2)),
      },
    });
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to calculate specific attendance percentage."
    );
  }
};

export const getOverallAttendancePercentage = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId query parameter is required." });
  }
  const numUserId = parseInt(userId, 10);
  if (isNaN(numUserId)) {
    return res.status(400).json({ success: false, message: "Invalid userId." });
  }

  try {
    const currentUserEnrollments = await UserSubject.findAll({
      where: { userId: numUserId },
      attributes: ["subjectId"],
      raw: true,
    });

    const enrolledSubjectIds = currentUserEnrollments.map(
      (enrollment) => enrollment.subjectId
    );

    if (enrolledSubjectIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "User is not currently enrolled in any subjects.",
        data: {
          userId: numUserId,
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          percentage: 0,
        },
      });
    }

    const result = await AttendanceRecord.findOne({
      where: {
        userId: numUserId,
        subjectId: { [Op.in]: enrolledSubjectIds },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalDays"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN status = 'Present' THEN 1 ELSE 0 END")
          ),
          "presentDays",
        ],
      ],
      raw: true,
    });

    const totalDays = parseInt(result.totalDays || 0);
    const presentDays = parseInt(result.presentDays || 0);
    const absentDays = totalDays - presentDays;
    const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    res.status(200).json({
      success: true,
      message: "Overall attendance percentage for currently enrolled subjects.",
      data: {
        userId: numUserId,
        totalDays,
        presentDays,
        absentDays,
        percentage: parseFloat(percentage.toFixed(2)),
      },
    });
  } catch (error) {
    handleError(
      res,
      error,
      "Failed to calculate overall attendance percentage for enrolled subjects."
    );
  }
};

export const getSubjectWisePercentages = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "userId query parameter is required." });
  }
  const numUserId = parseInt(userId, 10);
  if (isNaN(numUserId)) {
    return res.status(400).json({ success: false, message: "Invalid userId." });
  }

  try {
    const userWithSubjects = await User.findByPk(numUserId, {
      include: [
        {
          model: Subject,
          as: "enrolledSubjects",
          attributes: ["id", "name", "code"],
          through: { attributes: [] },
        },
      ],
      attributes: ["id"],
    });

    if (!userWithSubjects || !userWithSubjects.enrolledSubjects?.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    const enrolledSubjects = userWithSubjects.enrolledSubjects;
    const enrolledSubjectIds = enrolledSubjects.map((s) => s.id);

    const subjectStats = await AttendanceRecord.findAll({
      where: {
        userId: numUserId,
        subjectId: { [Op.in]: enrolledSubjectIds },
      },
      attributes: [
        "subjectId",
        [sequelize.fn("COUNT", sequelize.col("id")), "totalDays"],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN status = 'Present' THEN 1 ELSE 0 END")
          ),
          "presentDays",
        ],
      ],
      group: ["subjectId"],
      raw: true,
    });

    const results = enrolledSubjects.map((subject) => {
      const stats = subjectStats.find((s) => s.subjectId === subject.id);

      const totalDays = parseInt(stats?.totalDays || 0);
      const presentDays = parseInt(stats?.presentDays || 0);
      const absentDays = totalDays - presentDays;
      const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

      return {
        subjectId: subject.id,
        name: subject.name,
        code: subject.code,
        totalDays,
        presentDays,
        absentDays,
        percentage: parseFloat(percentage.toFixed(2)),
      };
    });

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    handleError(res, error, "Failed to calculate subject-wise percentages.");
  }
};
