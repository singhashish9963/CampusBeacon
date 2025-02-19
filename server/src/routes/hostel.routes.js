import express from "express";
import multer from "multer";
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
  deleteMenuMeal,
  createOfficial,
  getAllOfficials,
  getOfficialsByHostel,
  getOfficialById,
  editOfficial,
  deleteOfficial,
  createComplaint,
 getComplaints,
 getHostelComplaints,
 updateComplaint,
 deleteComplaint,
  createNotification,
 getNotifications,
  getHostelNotifications,
  updateNotification,
 deleteNotification
} from "../controllers/hostels.controller.js";

const router = express.Router();

const upload = multer({ dest: "./public/temp" });


/*
=============================
        Hostel Routes
=============================
*/

router.post("/hostels", createHostel); 
router.get("/hostels", getAllHostels); 
router.get("/hostels/:id", getHostelById); 
router.put("/hostels/:id", editHostel); 
router.delete("/hostels/:id", deleteHostel);

/*
=============================
        Menu Routes
=============================
*/

router.post("/menus", createMenu);
router.get("/menus/hostel/:hostel_id", getMenuByHostel);
router.get("/menus/:menu_id", getMenuById);
router.get("/menus/meal/:hostel_id/:day/:meal", getMenuMeal);
router.put("/menus/meal/:hostel_id/:day/:meal", updateMenuMeal);
router.delete("/menus/meal/:hostel_id/:day/:meal", deleteMenuMeal);

/*
=============================
        Officials Routes
=============================
*/

router.post("/officials", createOfficial);
router.get("/officials", getAllOfficials);
router.get("/officials/hostel/:hostel_id", getOfficialsByHostel);
router.get("officials/:official_id", getOfficialById);
router.put("officials/:official_id", editOfficial);
router.delete("officials/:official_id", deleteOfficial);



/*
=============================
        Complaint Routes
=============================
*/
router.post("/complaints", createComplaint);
router.get("/complaints", getComplaints);
router.get("/complaints/hostel/:hostel_id", getHostelComplaints);
router.put("/complaints/:complaint_id", updateComplaint); 
router.delete("/complaints/:complaint_id", deleteComplaint);



/*
=============================
        Notifications Routes
=============================
*/

router.post("/notifications", upload.single("file"), createNotification);
router.get("/notifications", getNotifications);
router.get("/notifications/:hostel_id", getHostelNotifications);
router.put("/notifications/:notification_id", upload.single("file"), updateNotification);
router.delete("/notifications/:notification_id", deleteNotification);


export default router;