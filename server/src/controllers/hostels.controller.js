import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import {
  Hostel,
  Menu,
  Official,
  Complaint,
  HostelNotification,
} from "../models/hostels.model.js";

/*
=============================
        Hostels Controllers 
=============================
*/

export const createHostel = asyncHandler(async (req, res) => {
  const { hostel_name } = req.body;
  if (!hostel_name?.trim()) {
    throw new ApiError("Hostel Name is required", 400);
  }
  const hostel = await Hostel.create({ hostel_name });
  res
    .status(201)
    .json(new ApiResponse(201, hostel, "Hostel created successfully"));
});

export const getAllHostels = asyncHandler(async (req, res) => {
  const hostels = await Hostel.findAll();
  res
    .status(200)
    .json(new ApiResponse(200, hostels, "Hostels retrieved successfully"));
});

export const getHostelById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hostel = await Hostel.findByPk(id);
  if (!hostel) {
    throw new ApiError("Hostel not found", 404);
  }
  res
    .status(200)
    .json(new ApiResponse(200, hostel, "Hostel retrieved successfully"));
});

export const editHostel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { hostel_name } = req.body;
  const hostel = await Hostel.findByPk(id);
  if (!hostel) {
    throw new ApiError("Hostel not found", 404);
  }
  if (hostel_name) hostel.hostel_name = hostel_name;
  await hostel.save();
  res
    .status(200)
    .json(new ApiResponse(200, hostel, "Hostel details updated successfully"));
});

export const deleteHostel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hostel = await Hostel.findByPk(id);
  if (!hostel) {
    throw new ApiError("Hostel not found", 404);
  }
  await hostel.destroy();
  res
    .status(200)
    .json(new ApiResponse(200, null, "Hostel deleted successfully"));
});

/*
=============================
        Menus Controllers 
=============================
*/

export const createMenu = asyncHandler(async (req, res, next) => {
  try {
    const {
      hostel_id,
      day,
      breakfast = "",
      lunch = "",
      snacks = "",
      dinner = "",
    } = req.body;
    if (!hostel_id || !day) {
      return next(new ApiError("Hostel ID and day are required", 400));
    }
    const hostel = await Hostel.findByPk(hostel_id);
    if (!hostel) {
      return next(new ApiError("Hostel not found", 404));
    }
    const existingMenu = await Menu.findOne({ where: { hostel_id, day } });
    if (existingMenu) {
      return next(new ApiError("Menu for this day already exists", 400));
    }
    const newMenu = await Menu.create({
      hostel_id,
      day,
      breakfast,
      lunch,
      snacks,
      dinner,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, newMenu, "Menu created successfully"));
  } catch (error) {
    console.error("Error in createMenu:", error);
    return next(new ApiError("Internal Server Error", 500));
  }
});

export const getMenuByHostel = asyncHandler(async (req, res) => {
  const { hostel_id } = req.params;
  const menus = await Menu.findAll({ where: { hostel_id } });
  if (!menus.length) {
    throw new ApiError("No menu found for this hostel", 404);
  }
  res
    .status(200)
    .json(new ApiResponse(200, menus, "Menu fetched successfully"));
});

export const getMenuById = asyncHandler(async (req, res) => {
  const { menu_id } = req.params;
  const menu = await Menu.findByPk(menu_id);
  if (!menu) {
    throw new ApiError("Menu not found", 404);
  }
  res
    .status(200)
    .json(new ApiResponse(200, menu, "Menu details fetched successfully"));
});

export const getMenuMeal = asyncHandler(async (req, res) => {
  const { hostel_id, day, meal } = req.params;
  if (!["breakfast", "lunch", "snacks", "dinner"].includes(meal)) {
    throw new ApiError("Invalid meal type", 400);
  }
  const menu = await Menu.findOne({ where: { hostel_id, day } });
  if (!menu || !menu[meal]) {
    throw new ApiError(`${meal} menu not found for this hostel on ${day}`, 404);
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { [meal]: menu[meal] },
        `${meal} menu fetched successfully`
      )
    );
});

// New function: update the entire menu record
export const updateMenu = asyncHandler(async (req, res) => {
  const { menu_id } = req.params;
  const { day, breakfast, lunch, snacks, dinner } = req.body;
  const menu = await Menu.findByPk(menu_id);
  if (!menu) {
    throw new ApiError("Menu not found", 404);
  }
  // Validate required fields
  if (!day) {
    throw new ApiError("Day is required", 400);
  }
  menu.day = day;
  menu.breakfast = breakfast;
  menu.lunch = lunch;
  menu.snacks = snacks;
  menu.dinner = dinner;
  await menu.save();
  res.status(200).json(new ApiResponse(200, menu, "Menu updated successfully"));
});

export const updateMenuMeal = asyncHandler(async (req, res) => {
  const { hostel_id, day, meal } = req.params;
  const { newMeal } = req.body;
  if (!["breakfast", "lunch", "snacks", "dinner"].includes(meal)) {
    throw new ApiError("Invalid meal type", 400);
  }
  const menu = await Menu.findOne({ where: { hostel_id, day } });
  if (!menu) {
    throw new ApiError("Menu not found", 404);
  }
  menu[meal] = newMeal;
  await menu.save();
  res
    .status(200)
    .json(new ApiResponse(200, menu, `${meal} updated successfully`));
});

export const deleteMenuMeal = asyncHandler(async (req, res) => {
  const { hostel_id, day, meal } = req.params;
  if (!["breakfast", "lunch", "snacks", "dinner"].includes(meal)) {
    throw new ApiError("Invalid meal type", 400);
  }
  const menu = await Menu.findOne({ where: { hostel_id, day } });
  if (!menu) {
    throw new ApiError("Menu not found", 404);
  }
  menu[meal] = null;
  await menu.save();
  res
    .status(200)
    .json(new ApiResponse(200, menu, `${meal} deleted successfully`));
});

/*
=============================
       Officials Controllers 
=============================
*/

export const createOfficial = asyncHandler(async (req, res, next) => {
  const { hostel_id, name, email, phone, designation } = req.body;
  if (!hostel_id || !name || !email || !phone || !designation) {
    throw new ApiError("All fields are required", 400);
  }
  const hostel = await Hostel.findByPk(hostel_id);
  if (!hostel) {
    throw new ApiError("Hostel not found", 404);
  }
  const official = await Official.create({
    hostel_id: Number(hostel_id),
    name,
    email,
    phone,
    designation,
  });
  res
    .status(201)
    .json(new ApiResponse(201, official, "Official added successfully"));
});

export const getAllOfficials = asyncHandler(async (req, res, next) => {
  const officials = await Official.findAll();
  res
    .status(200)
    .json(new ApiResponse(200, officials, "Officials retrieved successfully"));
});

export const getOfficialById = asyncHandler(async (req, res, next) => {
  const { official_id } = req.params;
  const official = await Official.findByPk(official_id);
  if (!official) {
    throw new ApiError("Official not found", 404);
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, official, "Official details retrieved successfully")
    );
});

export const getOfficialsByHostel = asyncHandler(async (req, res, next) => {
  const { hostel_id } = req.params;
  const officials = await Official.findAll({ where: { hostel_id } });
  if (!officials.length) {
    throw new ApiError("No officials found for this hostel", 404);
  }
  res
    .status(200)
    .json(new ApiResponse(200, officials, "Officials retrieved successfully"));
});

export const editOfficial = asyncHandler(async (req, res, next) => {
  const { official_id } = req.params;
  const { name, email, phone, designation } = req.body;
  const official = await Official.findByPk(official_id);
  if (!official) {
    throw new ApiError("Official not found", 404);
  }
  if (name) official.name = name;
  if (email) official.email = email;
  if (phone) official.phone = phone;
  if (designation) official.designation = designation;
  await official.save();
  res
    .status(200)
    .json(
      new ApiResponse(200, official, "Official details updated successfully")
    );
});

export const deleteOfficial = asyncHandler(async (req, res, next) => {
  const { official_id } = req.params;

  if (!official_id) {
    throw new ApiError("Official ID is required", 400);
  }

  const official = await Official.findByPk(official_id);

  if (!official) {
    throw new ApiError("Official not found", 404);
  }

  try {
    await official.destroy();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { officialId: official_id },
          "Official deleted successfully"
        )
      );
  } catch (error) {
    console.error("Error deleting official:", error);
    throw new ApiError("Failed to delete official", 500);
  }
});

/*
=============================
       Complaint Controllers 
=============================
*/
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const sendComplaintEmail = async (complaint) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: complaint.official_email,
      subject: `New Complaint: ${complaint.complaint_type}`,
      html: `
        <h2>New Complaint Submitted</h2>
        <p><strong>Complaint ID:</strong> ${complaint.complaint_id}</p>
        <p><strong>Hostel:</strong> ${complaint.hostel_id}</p>
        <p><strong>Student:</strong> ${complaint.student_name} (${
        complaint.student_email
      })</p>
        <p><strong>Complaint Type:</strong> ${complaint.complaint_type}</p>
        <p><strong>Description:</strong> ${complaint.complaint_description}</p>
        <p><strong>Due Date:</strong> ${new Date(
          complaint.due_date
        ).toLocaleDateString()}</p>
        <p>Please address this complaint before the due date.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const createComplaint = asyncHandler(async (req, res) => {
  const {
    hostel_id,
    student_name,
    student_email,
    official_id,
    official_ids, // support multiple officials if provided
    complaint_type,
    complaint_description,
    due_date,
  } = req.body;

  // Use official_ids if provided, else fall back to official_id
  const selectedOfficialId =
    official_ids && Array.isArray(official_ids) && official_ids.length > 0
      ? official_ids[0]
      : official_id;

  // Validate required fields
  if (
    !hostel_id ||
    !student_name ||
    !student_email ||
    !selectedOfficialId ||
    !complaint_type ||
    !complaint_description ||
    !due_date
  ) {
    throw new ApiError("All fields are required", 400);
  }

  const hostel = await Hostel.findByPk(hostel_id);
  if (!hostel) throw new ApiError("Hostel not found", 404);

  const official = await Official.findByPk(selectedOfficialId);
  if (!official) throw new ApiError("Official not found", 404);

  const complaint = await Complaint.create({
    hostel_id,
    student_name,
    student_email,
    official_id: selectedOfficialId,
    official_name: official.name,
    official_email: official.email,
    complaint_type,
    complaint_description,
    due_date,
  });

  await sendComplaintEmail(complaint);

  res
    .status(201)
    .json(new ApiResponse(201, complaint, "Complaint submitted successfully!"));
});


export const getAllComplaints = asyncHandler(async (req, res, next) => {
  const complaints = await Complaint.findAll();
  res
    .status(200)
    .json(
      new ApiResponse(200, complaints, "Complaints retrieved successfully")
    );
});

export const getComplaintById = asyncHandler(async (req, res, next) => {
  const { complaint_id } = req.params;
  const complaint = await Complaint.findByPk(complaint_id);
  if (!complaint) {
    throw new ApiError("Complaint not found", 404);
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        complaint,
        "Complaint details retrieved successfully"
      )
    );
});

export const getComplaintsByHostel = asyncHandler(async (req, res, next) => {
  const { hostel_id } = req.params;
  const complaints = await Complaint.findAll({ where: { hostel_id } });
  res
    .status(200)
    .json(
      new ApiResponse(200, complaints, "Complaints retrieved successfully")
    );
});

export const updateComplaint = asyncHandler(async (req, res) => {
  const { complaint_id } = req.params;
  const {
    hostel_id,
    student_name,
    student_email,
    official_id,
    complaint_type,
    complaint_description,
    due_date,
  } = req.body;
  const complaint = await Complaint.findByPk(complaint_id);
  if (!complaint) throw new ApiError("Complaint not found", 404);
  if (hostel_id) {
    const hostel = await Hostel.findByPk(hostel_id);
    if (!hostel) throw new ApiError("Hostel not found", 404);
  }
  let official_name, official_email;
  if (official_id) {
    const official = await Official.findByPk(official_id);
    if (!official) throw new ApiError("Official not found", 404);
    official_name = official.name;
    official_email = official.email;
  }
  await complaint.update({
    hostel_id,
    student_name,
    student_email,
    official_id,
    official_name,
    official_email,
    complaint_type,
    complaint_description,
    due_date,
  });
  res
    .status(200)
    .json(new ApiResponse(200, complaint, "Complaint updated successfully!"));
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  const { complaint_id } = req.params;
  const deleted = await Complaint.destroy({ where: { complaint_id } });
  if (deleted) {
    res
      .status(200)
      .json(new ApiResponse(200, null, "Complaint deleted successfully!"));
  } else {
    throw new ApiError("Complaint not found", 404);
  }
});

/*
=============================
       Notification Controllers 
=============================
*/

import { uploadImageToCloudinary,deleteImageFromCloudinary } from "../utils/cloudinary.js";
export const createNotification = asyncHandler(async (req, res) => {
  const { hostel_id, message } = req.body;
  if (!hostel_id || !message) {
    throw new ApiError("Hostel ID and message are required", 400);
  }
  const hostel = await Hostel.findByPk(hostel_id);
  if (!hostel) throw new ApiError("Hostel not found", 404);
  let file_url = null;
  if (req.file) {
    file_url = await uploadImageToCloudinary(req.file.path, "notifications");
  }
  const notification = await HostelNotification.create({
    hostel_id,
    message,
    file_url,
  });
  res
    .status(201)
    .json(
      new ApiResponse(201, notification, "Notification created successfully!")
    );
});

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await HostelNotification.findAll();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notifications,
        "All notifications retrieved successfully"
      )
    );
});

export const getHostelNotifications = asyncHandler(async (req, res) => {
  const { hostel_id } = req.params;
  const hostel = await Hostel.findByPk(hostel_id);
  if (!hostel) throw new ApiError("Hostel not found", 404);
  const notifications = await HostelNotification.findAll({
    where: { hostel_id },
  });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        notifications,
        "Notifications retrieved successfully"
      )
    );
});

export const updateNotification = asyncHandler(async (req, res) => {
  const { notification_id } = req.params;
  const { hostel_id, message } = req.body;
  const notification = await HostelNotification.findByPk(notification_id);
  if (!notification) throw new ApiError("Notification not found", 404);
  if (hostel_id) {
    const hostel = await Hostel.findByPk(hostel_id);
    if (!hostel) throw new ApiError("Hostel not found", 404);
  }
  let file_url = notification.file_url;
  if (req.file) {
    file_url = await uploadImageToCloudinary(req.file.path, "notifications");
  }
  await notification.update({
    hostel_id,
    message,
    file_url,
  });
  res
    .status(200)
    .json(
      new ApiResponse(200, notification, "Notification updated successfully")
    );
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { notification_id } = req.params;
  const notification = await HostelNotification.findByPk(notification_id);
  if (!notification) throw new ApiError("Notification not found", 404);

  // Delete the file from Cloudinary if it exists
  if (notification.file_url) {
    await deleteImageFromCloudinary(notification.file_url);
  }

  const deleted = await HostelNotification.destroy({
    where: { notification_id },
  });
  if (!deleted) throw new ApiError("Notification not found", 404);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Notification deleted successfully"));
});
