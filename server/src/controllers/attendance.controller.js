import { UserAttendance, AttendanceStats } from "../models/attendance.model.js";
import Subject from "../models/subject.model.js";
import User from "../models/user.model.js";
import { Op } from "sequelize";
import sequelize from "../db/db.js";

// Constants for attendance thresholds
const ATTENDANCE_THRESHOLD = 75; // Required attendance percentage
const WARNING_THRESHOLD = 80; // Threshold for warning alerts

// Get detailed attendance report for a specific student with improved performance
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

    // PERFORMANCE OPTIMIZATION: Use aggregate queries to calculate statistics directly
    const subjectStats = await UserAttendance.findAll({
      attributes: [
        'subject_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalClasses'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'Present' THEN 1 ELSE 0 END")), 'totalPresent'],
        [sequelize.fn('MAX', sequelize.col('date')), 'lastAttendance']
      ],
      where: {
        user_id: userId,
        ...dateFilter
      },
      include: [
        {
          model: Subject,
          attributes: ['name', 'code'],
        }
      ],
      group: ['subject_id', 'Subject.id'],
      raw: false
    });

    // Format the results
    const formattedStats = {};
    let overallClasses = 0;
    let overallPresent = 0;
    
    subjectStats.forEach(stat => {
      const subjectId = stat.subject_id;
      const totalClasses = parseInt(stat.dataValues.totalClasses);
      const totalPresent = parseInt(stat.dataValues.totalPresent);
      const attendancePercentage = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;
      
      formattedStats[subjectId] = {
        subjectName: stat.Subject.name,
        subjectCode: stat.Subject.code,
        totalClasses,
        totalPresent,
        attendancePercentage,
        lastAttendance: stat.dataValues.lastAttendance,
        atRisk: attendancePercentage < WARNING_THRESHOLD
      };
      
      overallClasses += totalClasses;
      overallPresent += totalPresent;
    });

    // Get individual attendance records for detailed view
    const attendanceRecords = await UserAttendance.findAll({
      where: {
        user_id: userId,
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

    // Calculate overall statistics
    const overallStats = {
      totalClasses: overallClasses,
      totalPresent: overallPresent,
      overallPercentage: overallClasses > 0 ? (overallPresent / overallClasses) * 100 : 0,
      subjectsAtRisk: Object.values(formattedStats).filter(stats => stats.atRisk).length,
    };

    res.status(200).json({
      message: "Student attendance report generated successfully",
      data: {
        studentInfo: {
          id: user.id,
          name: user.name,
          registrationNumber: user.registration_number,
        },
        overallStats,
        subjectWiseStats: formattedStats,
        attendanceRecords: attendanceRecords,
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

// Get attendance report for a specific subject with improved performance
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

    // PERFORMANCE OPTIMIZATION: Use aggregate queries to calculate statistics directly
    const studentStats = await UserAttendance.findAll({
      attributes: [
        'user_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalClasses'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'Present' THEN 1 ELSE 0 END")), 'totalPresent'],
        [sequelize.fn('MAX', sequelize.col('date')), 'lastAttendance']
      ],
      where: {
        subject_id: subjectId,
        ...dateFilter
      },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'registration_number'],
        }
      ],
      group: ['user_id', 'User.id'],
      raw: false
    });

    // Format the results
    const formattedStats = {};
    let totalAttendancePercentage = 0;
    let atRiskCount = 0;
    
    studentStats.forEach(stat => {
      const userId = stat.user_id;
      const totalClasses = parseInt(stat.dataValues.totalClasses);
      const totalPresent = parseInt(stat.dataValues.totalPresent);
      const attendancePercentage = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;
      const atRisk = attendancePercentage < WARNING_THRESHOLD;
      
      formattedStats[userId] = {
        studentInfo: {
          id: stat.User.id,
          name: stat.User.name,
          registrationNumber: stat.User.registration_number,
        },
        totalClasses,
        totalPresent,
        attendancePercentage,
        lastAttendance: stat.dataValues.lastAttendance,
        atRisk
      };
      
      totalAttendancePercentage += attendancePercentage;
      if (atRisk) atRiskCount++;
    });

    // Generate alerts for students below threshold
    const alerts = Object.values(formattedStats)
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

    const studentCount = Object.keys(formattedStats).length;
    const averageAttendance = studentCount > 0 ? totalAttendancePercentage / studentCount : 0;

    res.status(200).json({
      message: "Subject attendance report generated successfully",
      data: {
        subjectInfo: {
          id: subject.id,
          name: subject.name,
          code: subject.code,
        },
        overallStats: {
          totalStudents: studentCount,
          studentsAtRisk: atRiskCount,
          averageAttendance: averageAttendance,
        },
        studentWiseStats: formattedStats,
        alerts: alerts,
      },
    });
  } catch (error) {
    console.error("Error generating subject attendance report:", error);
    res.status(500).json({
      message: "An error occurred while generating the subject attendance report",
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

// Generate attendance alerts
export const generateAttendanceAlerts = async (req, res) => {
  try {
    // PERFORMANCE OPTIMIZATION: Use a more efficient query
    const alerts = await UserAttendance.findAll({
      attributes: [
        'user_id',
        'subject_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalClasses'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'Present' THEN 1 ELSE 0 END")), 'totalPresent'],
        [sequelize.literal(`(SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*))`), 'percentage']
      ],
      include: [
        {
          model: User,
          attributes: ['name', 'registration_number', 'email'],
        },
        {
          model: Subject,
          attributes: ['name', 'code'],
        }
      ],
      group: ['user_id', 'subject_id', 'User.id', 'Subject.id'],
      having: sequelize.literal(`(SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) < ${WARNING_THRESHOLD}`),
    });

    const formattedAlerts = alerts.map((alert) => {
      const totalClasses = parseInt(alert.dataValues.totalClasses);
      const totalPresent = parseInt(alert.dataValues.totalPresent);
      const percentage = parseFloat(alert.dataValues.percentage);
      
      return {
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
          percentage: percentage.toFixed(2),
          totalClasses,
          totalPresent,
          requiredClasses: calculateRequiredClasses(totalPresent, totalClasses),
        },
      };
    });

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

// Create a new attendance record with duplicate check
export const createAttendance = async (req, res) => {
  try {
    const { userId, subjectId, date, status } = req.body;
    if (!userId || !subjectId || !date || !status) {
      return res.status(400).json({
        message: "userId, subjectId, date, and status are required",
      });
    }

    // Check for duplicate entry
    const existingRecord = await UserAttendance.findOne({
      where: {
        user_id: userId,
        subject_id: subjectId,
        date: date
      }
    });

    if (existingRecord) {
      return res.status(409).json({
        message: "Attendance record already exists for this user, subject, and date",
        data: existingRecord
      });
    }

    const attendance = await UserAttendance.create({
      user_id: userId,
      subject_id: subjectId,
      date,
      status,
    });

    // Update or create attendance stats
    await updateAttendanceStats(userId, subjectId);

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

    // Check for duplicate if date or subject or user is changing
    if ((date && date !== attendance.date) || 
        (subjectId && subjectId !== attendance.subject_id) || 
        (userId && userId !== attendance.user_id)) {
      const existingRecord = await UserAttendance.findOne({
        where: {
          user_id: userId || attendance.user_id,
          subject_id: subjectId || attendance.subject_id,
          date: date || attendance.date,
          id: { [Op.ne]: id } // Exclude current record
        }
      });

      if (existingRecord) {
        return res.status(409).json({
          message: "Another attendance record already exists for this user, subject, and date",
          data: existingRecord
        });
      }
    }

    // Update the record
    attendance.user_id = userId !== undefined ? userId : attendance.user_id;
    attendance.subject_id = subjectId !== undefined ? subjectId : attendance.subject_id;
    attendance.date = date !== undefined ? date : attendance.date;
    attendance.status = status !== undefined ? status : attendance.status;

    await attendance.save();

    // Update attendance stats
    await updateAttendanceStats(
      attendance.user_id, 
      attendance.subject_id
    );

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
    
    // Store user and subject IDs before deletion for stats update
    const userId = attendance.user_id;
    const subjectId = attendance.subject_id;
    
    await attendance.destroy();
    
    // Update attendance stats after deletion
    await updateAttendanceStats(userId, subjectId);
    
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
    
    // Check if stats already exist
    const existingStats = await AttendanceStats.findOne({
      where: {
        user_id: userId,
        subject_id: subjectId
      }
    });
    
    if (existingStats) {
      return res.status(409).json({
        message: "Attendance statistics already exist for this user and subject",
        data: existingStats
      });
    }
    
    const stats = await AttendanceStats.create({
      user_id: userId,
      subject_id: subjectId,
      total_classes: totalClasses || 0,
      total_present: totalPresent || 0,
      last_updated: new Date()
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
export const getAttendanceStatsById = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await AttendanceStats.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'registration_number'],
        },
        {
          model: Subject,
          attributes: ['id', 'name', 'code'],
        }
      ]
    });
    
    if (!stats) {
      return res.status(404).json({
        message: "Attendance statistics not found",
      });
    }
    
    // Calculate percentage
    const percentage = stats.total_classes > 0 
      ? (stats.total_present / stats.total_classes) * 100 
      : 0;
    
    // Format response
    const formattedStats = {
      ...stats.toJSON(),
      percentage: percentage,
      formattedPercentage: percentage.toFixed(2) + '%',
      isAtRisk: percentage < WARNING_THRESHOLD,
      needsImprovement: percentage < ATTENDANCE_THRESHOLD
    };
    
    res.status(200).json({
      message: "Attendance statistics retrieved successfully",
      data: formattedStats,
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
    // PERFORMANCE OPTIMIZATION: Use pagination and filtering
    const { page = 1, limit = 50, userId, subjectId } = req.query;
    const offset = (page - 1) * limit;
    
    // Build filter conditions
    const whereConditions = {};
    if (userId) whereConditions.user_id = userId;
    if (subjectId) whereConditions.subject_id = subjectId;
    
    // Get total count
    const totalCount = await AttendanceStats.count({
      where: whereConditions
    });
    
    // Get stats with pagination
    const stats = await AttendanceStats.findAll({
      where: whereConditions,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'registration_number'],
        },
        {
          model: Subject,
          attributes: ['id', 'name', 'code'],
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['last_updated', 'DESC']]
    });
    
    // Format response
    const formattedStats = stats.map(stat => {
      const percentage = stat.total_classes > 0 
        ? (stat.total_present / stat.total_classes) * 100 
        : 0;
      
      return {
        ...stat.toJSON(),
        percentage: percentage,
        formattedPercentage: percentage.toFixed(2) + '%',
        isAtRisk: percentage < WARNING_THRESHOLD,
        needsImprovement: percentage < ATTENDANCE_THRESHOLD
      };
    });
    
    res.status(200).json({
      message: "Attendance statistics retrieved successfully",
      data: {
        totalRecords: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        stats: formattedStats
      }
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

    // Check for duplicate if user or subject is changing
    if ((userId && userId !== stats.user_id) || 
        (subjectId && subjectId !== stats.subject_id)) {
      const existingStats = await AttendanceStats.findOne({
        where: {
          user_id: userId || stats.user_id,
          subject_id: subjectId || stats.subject_id,
          id: { [Op.ne]: id } // Exclude current record
        }
      });
      
      if (existingStats) {
        return res.status(409).json({
          message: "Attendance statistics already exist for this user and subject",
          data: existingStats
        });
      }
    }

    stats.user_id = userId !== undefined ? userId : stats.user_id;
    stats.subject_id = subjectId !== undefined ? subjectId : stats.subject_id;
    stats.total_classes = totalClasses !== undefined ? totalClasses : stats.total_classes;
    stats.total_present = totalPresent !== undefined ? totalPresent : stats.total_present;
    stats.last_updated = new Date();

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

// Recalculate all attendance statistics
export const recalculateAllStats = async (req, res) => {
  try {
    // Get all unique user-subject combinations
    const userSubjectPairs = await UserAttendance.findAll({
      attributes: [
        'user_id', 
        'subject_id', 
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_records']
      ],
      group: ['user_id', 'subject_id'],
      raw: true
    });
    
    // Process each user-subject pair
    const results = [];
    for (const pair of userSubjectPairs) {
      const userId = pair.user_id;
      const subjectId = pair.subject_id;
      
      // Update stats for this pair
      const updatedStats = await updateAttendanceStats(userId, subjectId);
      results.push(updatedStats);
    }
    
    res.status(200).json({
      message: "All attendance statistics recalculated successfully",
      data: {
        totalRecords: results.length,
        results: results
      }
    });
  } catch (error) {
    console.error("Error recalculating attendance statistics:", error);
    res.status(500).json({
      message: "An error occurred while recalculating attendance statistics",
      error: error.message,
    });
  }
};

// Bulk import attendance records
export const bulkImportAttendance = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { records } = req.body;
    
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        message: "Records must be a non-empty array",
      });
    }
    
    // Validate all records before processing
    for (const record of records) {
      const { userId, subjectId, date, status } = record;
      if (!userId || !subjectId || !date || !status) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Each record must contain userId, subjectId, date, and status",
          invalidRecord: record
        });
      }
    }
    
    // Process records
    const results = {
      created: [],
      skipped: []
    };
    
    for (const record of records) {
      const { userId, subjectId, date, status } = record;
      
      // Check for duplicate
      const existingRecord = await UserAttendance.findOne({
        where: {
          user_id: userId,
          subject_id: subjectId,
          date: date
        },
        transaction
      });
      
      if (existingRecord) {
        results.skipped.push({
          ...record,
          reason: "Duplicate record"
        });
        continue;
      }
      
      // Create new record
      const attendance = await UserAttendance.create({
        user_id: userId,
        subject_id: subjectId,
        date,
        status,
      }, { transaction });
      
      results.created.push(attendance);
    }
    
    // Update stats for affected user-subject pairs
    const affectedPairs = new Set();
    results.created.forEach(record => {
      affectedPairs.add(`${record.user_id}_${record.subject_id}`);
    });
    
    for (const pair of affectedPairs) {
      const [userId, subjectId] = pair.split('_');
      await updateAttendanceStats(userId, subjectId, transaction);
    }
    
    await transaction.commit();
    
    res.status(201).json({
      message: "Attendance records imported successfully",
      data: {
        total: records.length,
        created: results.created.length,
        skipped: results.skipped.length,
        skippedRecords: results.skipped
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error importing attendance records:", error);
    res.status(500).json({
      message: "An error occurred while importing attendance records",
      error: error.message,
    });
  }
};