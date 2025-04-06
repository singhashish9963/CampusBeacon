import {
  User,
  Subject,
  UserSubject,
  AttendanceRecord,
} from "../models/association.js";
import { Op } from "sequelize";
import sequelize from "../db/db.js";

const handleError = (res, error, message = "An unexpected error occurred", statusCode = 500) => {
  console.error(`Error in UserSubjectController: ${message}`, error);
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

export const enrollUserInSubject = async (req, res) => {
  const { userId, subjectId, subjectIds } = req.body;
  const targetSubjectIds = subjectId ? [subjectId] : subjectIds;

  if (
    !userId ||
    !targetSubjectIds ||
    !Array.isArray(targetSubjectIds) ||
    targetSubjectIds.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message: "userId and a non-empty subjectId or subjectIds array are required.",
    });
  }

  const numUserId = parseInt(userId, 10);
  if (isNaN(numUserId)) {
    return res.status(400).json({ success: false, message: "Invalid userId." });
  }
  const numSubjectIds = targetSubjectIds
    .map((id) => parseInt(id, 10))
    .filter((id) => !isNaN(id));
  if (numSubjectIds.length !== targetSubjectIds.length) {
    return res.status(400).json({
      success: false,
      message: "One or more invalid subjectIds provided.",
    });
  }

  try {
    const userExists = await User.findByPk(numUserId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${numUserId} not found.`,
      });
    }

    const subjectsExist = await Subject.findAll({
      where: { id: { [Op.in]: numSubjectIds } },
    });
    if (subjectsExist.length !== numSubjectIds.length) {
      const foundIds = subjectsExist.map((s) => s.id);
      const notFoundIds = numSubjectIds.filter((id) => !foundIds.includes(id));
      return res.status(404).json({
        success: false,
        message: `Subject(s) not found: ${notFoundIds.join(", ")}.`,
      });
    }

    const enrollmentsToCreate = numSubjectIds.map((sId) => ({
      userId: numUserId,
      subjectId: sId,
    }));

    const createdEnrollments = await UserSubject.bulkCreate(enrollmentsToCreate, {
      ignoreDuplicates: true,
    });

    const successfulIds = createdEnrollments.map((e) => e.subjectId);

    res.status(201).json({
      success: true,
      message: `Enrollment process completed.`,
      data: { userId: numUserId, enrolledSubjectIds: numSubjectIds },
    });
  } catch (error) {
    handleError(res, error, "Failed to process enrollment request.");
  }
};

export const unenrollUserFromSubject = async (req, res) => {
  const { userId, subjectId } = req.body;

  if (userId == null || subjectId == null) {
    return res.status(400).json({
      success: false,
      message: "userId and subjectId are required in the request body.",
    });
  }

  const numUserId = parseInt(userId, 10);
  const numSubjectId = parseInt(subjectId, 10);

  if (isNaN(numUserId) || isNaN(numSubjectId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid userId or subjectId." });
  }

  const transaction = await sequelize.transaction();

  try {
    const deletedEnrollmentCount = await UserSubject.destroy({
      where: { userId: numUserId, subjectId: numSubjectId },
      transaction,
    });

    if (deletedEnrollmentCount === 0) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Enrollment record not found for this user and subject.",
      });
    }

    const deletedAttendanceCount = await AttendanceRecord.destroy({
      where: { userId: numUserId, subjectId: numSubjectId },
      transaction,
    });

    console.log(
      `Deleted ${deletedAttendanceCount} attendance records for user ${numUserId}, subject ${numSubjectId} during unenrollment.`
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "User successfully unenrolled and associated attendance data removed.",
    });
  } catch (error) {
    await transaction.rollback();
    handleError(res, error, "Failed to unenroll user and remove attendance data.");
  }
};

export const getUserEnrollments = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required in the URL path.",
    });
  }
  const numUserId = parseInt(userId, 10);
  if (isNaN(numUserId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid User ID in URL." });
  }

  try {
    const user = await User.findByPk(numUserId, {
      include: [
        {
          model: Subject,
          as: "enrolledSubjects",
          attributes: ["id", "name", "code", "icon", "credit"],
          through: { attributes: [] },
        },
      ],
      attributes: ["id"],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${numUserId} not found.`,
      });
    }

    res.status(200).json({ success: true, data: user.enrolledSubjects || [] });
  } catch (error) {
    handleError(res, error, "Failed to retrieve user enrollments.");
  }
};

export const getSubjectEnrollments = async (req, res) => {
  const { subjectId } = req.params;

  if (!subjectId) {
    return res.status(400).json({
      success: false,
      message: "Subject ID is required in the URL path.",
    });
  }
  const numSubjectId = parseInt(subjectId, 10);
  if (isNaN(numSubjectId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Subject ID in URL." });
  }

  try {
    const subject = await Subject.findByPk(numSubjectId, {
      include: [
        {
          model: User,
          as: "enrolledUsers",
          attributes: [
            "id",
            "name",
            "registration_number",
            "email",
            "semester",
            "branch",
          ],
          through: { attributes: [] },
        },
      ],
      attributes: ["id", "name", "code"],
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: `Subject with ID ${numSubjectId} not found.`,
      });
    }

    res.status(200).json({ success: true, data: subject.enrolledUsers || [] });
  } catch (error) {
    handleError(res, error, "Failed to retrieve subject enrollments.");
  }
};
