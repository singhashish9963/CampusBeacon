import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Hostel, Menu,Official,Complaint,Notification } from "../models/hostels.model.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

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
  console.log(req.body);

  const hostel = await Hostel.create({ hostel_name });
  res.status(201).json(new ApiResponse(201, hostel, "Hostel created successfully"));

});

export const getAllHostels = asyncHandler(async (req, res) => {
  const hostels = await Hostel.findAll();
  res.status(200).json(new ApiResponse(200, hostels, "Hostels retrieved successfully"));
});

export const getHostelById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hostel = await Hostel.findByPk(id);
  if (!hostel) {
    throw new ApiError("Hostel not found", 404);
  }
  res.status(200).json(new ApiResponse(200, hostel, "Hostel retrieved successfully"));
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
  res.status(200).json(new ApiResponse(200, hostel, "Hostel details updated successfully"));
});

export const deleteHostel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hostel = await Hostel.findByPk(id);
  if (!hostel) {
    throw new ApiError("Hostel not found", 404);
  }
  await hostel.destroy();
  res.status(200).json(new ApiResponse(200, null, "Hostel deleted successfully"));
});

/*
=============================
        Menus Controllers 
=============================
*/

export const createMenu = asyncHandler(async (req, res, next) => {
  try {
    console.log("Incoming request data:", req.body); 

    const { hostel_id, day, breakfast = "", lunch = "", snacks = "", dinner = "" } = req.body;

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

    const newMenu = await Menu.create({ hostel_id, day, breakfast, lunch, snacks, dinner });

    return res.status(201).json(new ApiResponse(201, newMenu, "Menu created successfully"));
  } catch (error) {
    console.error(" Sequelize Error:", error); 
    return next(new ApiError("Internal Server Error", 500));
  }
});



export const getMenuByHostel = asyncHandler(async (req, res) => {
  const { hostel_id } = req.params;

  const menus = await Menu.findAll({ where: { hostel_id } });
  if (!menus.length) {
    throw new ApiError("No menu found for this hostel", 404);
  }

  res.status(200).json(new ApiResponse(200, menus, "Menu fetched successfully"));
});

export const getMenuById = asyncHandler(async (req, res) => {
  const { menu_id } = req.params;
  const menu = await Menu.findByPk(menu_id);
  if (!menu) {
    throw new ApiError("Menu not found", 404);
  }
  res.status(200).json(new ApiResponse(200, menu, "Menu details fetched successfully"));
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

  res.status(200).json(new ApiResponse(200, { [meal]: menu[meal] }, `${meal} menu fetched successfully`));
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
  res.status(200).json(new ApiResponse(200, menu, `${meal} updated successfully`));
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
  res.status(200).json(new ApiResponse(200, menu, `${meal} deleted successfully`));
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

    const official = await Official.create({ hostel_id, name, email, phone, designation });

    res.status(201).json(new ApiResponse(201, official, "Official added successfully"));
});



export const getAllOfficials = asyncHandler(async (req, res, next) => {
    const officials = await Official.findAll();

    res.status(200).json(new ApiResponse(200, officials, "Officials retrieved successfully"));
});



export const getOfficialById = asyncHandler(async (req, res, next) => {
    const { official_id } = req.params;

    const official = await Official.findByPk(official_id);
    if (!official) {
        throw new ApiError("Official not found", 404);
    }

    res.status(200).json(new ApiResponse(200, official, "Official details retrieved successfully"));
});



export const getOfficialsByHostel = asyncHandler(async (req, res, next) => {
    const { hostel_id } = req.params;

    const officials = await Official.findAll({ where: { hostel_id } });
    if (!officials.length) {
        throw new ApiError("No officials found for this hostel", 404);
    }

    res.status(200).json(new ApiResponse(200, officials, "Officials retrieved successfully"));
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
    res.status(200).json(new ApiResponse(200, official, "Official details updated successfully"));
});



export const deleteOfficial = asyncHandler(async (req, res, next) => {
    const { official_id } = req.params;

    const official = await Official.findByPk(official_id);
    if (!official) {
        throw new ApiError("Official not found", 404);
    }

    await official.destroy();
    res.status(200).json(new ApiResponse(200, null, "Official deleted successfully"));
});




/*
=============================
        Complaint Controllers 
=============================
*/

export const createComplaint = asyncHandler(async (req, res) => {
  const { hostel_id, student_name, student_email, official_id, complaint_type, complaint_description, due_date } = req.body;

  if (!hostel_id || !student_name || !student_email || !official_id || !complaint_type || !complaint_description || !due_date) {
    throw new ApiError("All fields are required", 400);
  }

  const hostel = await Hostel.findByPk(hostel_id);
  if (!hostel) throw new ApiError("Hostel not found", 404);

  const official = await Official.findByPk(official_id);
  if (!official) throw new ApiError("Official not found", 404);

  const complaint = await Complaint.create({
    hostel_id,
    student_name,
    student_email,
    official_id,
    official_name: official.name,
    official_email: official.email,
    complaint_type,
    complaint_description,
    due_date,
  });

  res.status(201).json(new ApiResponse(201, complaint, "Complaint submitted successfully!"));
});

export const getComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.findAll();
  res.status(200).json(complaints);
});

export const getHostelComplaints = asyncHandler(async (req, res) => {
  const { hostel_id } = req.params;
  const complaints = await Complaint.findAll({ where: { hostel_id } });

  res.status(200).json(complaints);
});

export const updateComplaint = asyncHandler(async (req, res) => {
  const { complaint_id } = req.params;
  const { hostel_id, student_name, student_email, official_id, complaint_type, complaint_description, due_date } = req.body;

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

  res.status(200).json(new ApiResponse(200, complaint, "Complaint updated successfully!"));
});

export const deleteComplaint = asyncHandler(async (req, res) => {
  const { complaint_id } = req.params;
  const deleted = await Complaint.destroy({ where: { complaint_id } });

  if (deleted) {
    res.status(200).json(new ApiResponse(200, null, "Complaint deleted successfully!"));
  } else {
    throw new ApiError("Complaint not found", 404);
  }
});





/*
=============================
        Notification Controllers 
=============================
*/


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

  const notification = await Notification.create({
    hostel_id,
    message,
    file_url,
  });

  res.status(201).json(new ApiResponse(201, notification, "Notification created successfully!"));
});

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.findAll();
  res.status(200).json(new ApiResponse(200, notifications, "All notifications retrieved successfully"));
});

export const getHostelNotifications = asyncHandler(async (req, res) => {
  const { hostel_id } = req.params;
  
  const hostel = await Hostel.findByPk(hostel_id);
  if (!hostel) throw new ApiError("Hostel not found", 404);

  const notifications = await Notification.findAll({ where: { hostel_id } });
  res.status(200).json(new ApiResponse(200, notifications, "Notifications retrieved successfully"));
});

export const updateNotification = asyncHandler(async (req, res) => {
  const { notification_id } = req.params;
  const { hostel_id, message } = req.body;

  const notification = await Notification.findByPk(notification_id);
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

  res.status(200).json(new ApiResponse(200, notification, "Notification updated successfully"));
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { notification_id } = req.params;

  const deleted = await Notification.destroy({ where: { notification_id } });

  if (!deleted) throw new ApiError("Notification not found", 404);

  res.status(200).json(new ApiResponse(200, null, "Notification deleted successfully"));
});
