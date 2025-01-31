import express from "express";
import multer from "multer";
import {
  createLostItem,
  updateLostItem,
  deleteLostItem,
  getLostItem,
  getAllLostItems,
  getLostItemsByRegistration,
} from "../controllers/lostandfound.controller.js";

const router = express.Router();


const upload = multer({ dest: "uploads/" });


router.post("/lost-items", upload.single("image"), createLostItem);
router.put("/lost-items/:id", upload.single("image"), updateLostItem);
router.delete("/lost-items/:id", deleteLostItem);
router.get("/lost-items/:id", getLostItem);
router.get("/lost-items", getAllLostItems);
router.get(
  "/lost-items/registration/:registration_number",
  getLostItemsByRegistration
);


export default router;
