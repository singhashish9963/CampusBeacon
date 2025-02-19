import UserSubjects from "../models/userSubjects.model.js";
import Subject from "../models/subject.model.js";

// Create a new subject
export const createSubject = async (req, res) => {
  try {
    const { name, code, credit, icon } = req.body;
    const subject = await Subject.create({
      name,
      code,
      credit,
      icon,
    });
    res.status(201).json({
      message: "Subject created successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({
      message: "An error occurred while creating the subject",
      error: error.message,
    });
  }
};

// Get subject by ID
export const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }
    res.status(200).json({
      message: "Subject retrieved successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Error retrieving subject:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the subject",
      error: error.message,
    });
  }
};

// Get all subjects
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    res.status(200).json({
      message: "Subjects retrieved successfully",
      data: subjects,
    });
  } catch (error) {
    console.error("Error retrieving subjects:", error);
    res.status(500).json({
      message: "An error occurred while retrieving subjects",
      error: error.message,
    });
  }
};

// Update subject by ID
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, credit, icon } = req.body;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }

    subject.name = name !== undefined ? name : subject.name;
    subject.code = code !== undefined ? code : subject.code;
    subject.credit = credit !== undefined ? credit : subject.credit;
    subject.icon = icon !== undefined ? icon : subject.icon;

    await subject.save();

    res.status(200).json({
      message: "Subject updated successfully",
      data: subject,
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({
      message: "An error occurred while updating the subject",
      error: error.message,
    });
  }
};

// Delete subject by ID
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({
        message: "Subject not found",
      });
    }
    await subject.destroy();
    res.status(200).json({
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({
      message: "An error occurred while deleting the subject",
      error: error.message,
    });
  }
};

// Create a new UserSubject (assign a subject to a user)
export const createUserSubject = async (req, res) => {
  const { userId, subjectId } = req.body;
  try {
    // First, check if the subject exists in the subjects table
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(400).json({
        success: false,
        message: `Subject with id ${subjectId} does not exist.`,
      });
    }

    // Optionally, check if the assignment already exists
    const existingAssignment = await UserSubjects.findOne({
      where: { userId, subjectId },
    });
    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: "User subject assignment already exists.",
      });
    }

    // Create the user subject assignment
    const userSubject = await UserSubjects.create({
      userId,
      subjectId,
    });

    return res.status(201).json({
      success: true,
      data: userSubject,
    });
  } catch (error) {
    console.error("Error creating user subject assignment:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "An error occurred while creating the user subject assignment",
    });
  }
};

// Get a UserSubject by its ID
export const getUserSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userSubject = await UserSubjects.findByPk(id);
    if (!userSubject) {
      return res.status(404).json({
        message: "User subject assignment not found",
      });
    }
    return res.status(200).json({
      message: "User subject assignment retrieved successfully",
      data: userSubject,
    });
  } catch (error) {
    console.error("Error fetching user subject assignment:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving the user subject assignment",
      error: error.message,
    });
  }
};

// Get all UserSubject records
export const getAllUserSubjects = async (req, res) => {
  try {
    const userSubjects = await UserSubjects.findAll();
    return res.status(200).json({
      message: "User subject assignments retrieved successfully",
      data: userSubjects,
    });
  } catch (error) {
    console.error("Error retrieving user subject assignments:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving user subject assignments",
      error: error.message,
    });
  }
};

// Update a UserSubject by its ID
export const updateUserSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, subjectId } = req.body;

    const userSubject = await UserSubjects.findByPk(id);
    if (!userSubject) {
      return res.status(404).json({
        message: "User subject assignment not found",
      });
    }

    // Update fields if provided
    userSubject.userId = userId !== undefined ? userId : userSubject.userId;
    userSubject.subjectId =
      subjectId !== undefined ? subjectId : userSubject.subjectId;

    await userSubject.save();

    return res.status(200).json({
      message: "User subject assignment updated successfully",
      data: userSubject,
    });
  } catch (error) {
    console.error("Error updating user subject assignment:", error);
    return res.status(500).json({
      message: "An error occurred while updating the user subject assignment",
      error: error.message,
    });
  }
};

// Delete a UserSubject by its ID
export const deleteUserSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const userSubject = await UserSubjects.findByPk(id);
    if (!userSubject) {
      return res.status(404).json({
        message: "User subject assignment not found",
      });
    }
    await userSubject.destroy();
    return res.status(200).json({
      message: "User subject assignment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user subject assignment:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the user subject assignment",
      error: error.message,
    });
  }
};
