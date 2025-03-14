import express from "express";
import multer from "multer";
import filterInputMiddleware from "../middlewares/filter.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  createHostel,
  getAllHostels,
  getHostelById,
  editHostel,
  deleteHostel,
  createMenu,
  getMenuByHostel,
  getMenuById,
  getMenuMeal,
  updateMenuMeal,
  // New updateMenu route
  updateMenu,
  deleteMenuMeal,
  createOfficial,
  getAllOfficials,
  getOfficialsByHostel,
  getOfficialById,
  editOfficial,
  deleteOfficial,
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintsByHostel,
  updateComplaint,
  deleteComplaint,
  createNotification,
  getNotifications,
  getHostelNotifications,
  updateNotification,
  deleteNotification,
} from "../controllers/hostels.controller.js";

const router = express.Router();
const upload = multer({ dest: "./public/temp" });

/*
=============================
        Hostel Routes
=============================
*/
router.post("/hostels", authMiddleware, createHostel);
router.get("/hostels", authMiddleware, getAllHostels);
router.get("/hostels/:id", authMiddleware, getHostelById);
router.put("/hostels/:id", authMiddleware, editHostel);
router.delete("/hostels/:id", authMiddleware, deleteHostel);

/*
=============================
        Menu Routes
=============================
*/
router.post("/menus", authMiddleware, createMenu);
router.get("/menus/hostel/:hostel_id", authMiddleware, getMenuByHostel);
router.get("/menus/:menu_id", authMiddleware, getMenuById);
router.get("/menus/meal/:hostel_id/:day/:meal", authMiddleware, getMenuMeal);
// New route for updating entire menu
router.put("/menus/:menu_id", authMiddleware, updateMenu);
router.put("/menus/meal/:hostel_id/:day/:meal", authMiddleware, updateMenuMeal);
router.delete(
  "/menus/meal/:hostel_id/:day/:meal",
  authMiddleware,
  deleteMenuMeal
);

/*
=============================
        Officials Routes
=============================
*/
router.post("/officials", authMiddleware, createOfficial);
router.get("/officials", authMiddleware, getAllOfficials);
router.get(
  "/officials/hostel/:hostel_id",
  authMiddleware,
  getOfficialsByHostel
);
router.get("/officials/:official_id", authMiddleware, getOfficialById);
router.put("/officials/:official_id", authMiddleware, editOfficial);
router.delete("/officials/:official_id", authMiddleware, deleteOfficial);

/*
=============================
        Complaint Routes
=============================
*/
router.post("/complaints", authMiddleware, createComplaint);
router.get("/complaints", authMiddleware, getAllComplaints);
router.get("/complaints/:complaint_id", authMiddleware, getComplaintById);
router.get(
  "/complaints/hostel/:hostel_id",
  authMiddleware,
  getComplaintsByHostel
);
router.put("/complaints/:complaint_id", authMiddleware, updateComplaint);
router.delete("/complaints/:complaint_id", authMiddleware, deleteComplaint);

/*
=============================
        Notifications Routes
=============================
*/
router.post(
  "/notifications",
  upload.single("file"),
  authMiddleware,
  filterInputMiddleware,
  createNotification
);
router.get("/notifications", authMiddleware, getNotifications);
router.get("/notifications/:hostel_id", authMiddleware, getHostelNotifications);
router.put(
  "/notifications/:notification_id",
  upload.single("file"),
  authMiddleware,
  filterInputMiddleware,
  updateNotification
);
router.delete(
  "/notifications/:notification_id",
  authMiddleware,
  deleteNotification
);

export default router;
