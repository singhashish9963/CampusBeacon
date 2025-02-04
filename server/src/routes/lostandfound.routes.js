import express from "express";
import multer from "multer";
import {
  createLostItem,
  updateLostItem,
  deleteLostItem,
  getLostItem,
  getAllLostItems,
} from "../controllers/lostandfound.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js"
const router = express.Router();


const upload = multer({ dest: "./public/temp" });


router.post("/lost-items", upload.single("image"),authMiddleware, createLostItem);
router.put(
  "/lost-items/:id",
  upload.single("image"),
  authMiddleware,
  updateLostItem
);
router.delete("/lost-items/:id", authMiddleware, deleteLostItem);
router.get("/lost-items/:id", authMiddleware, getLostItem);
router.get("/lost-items", authMiddleware, getAllLostItems);



export default router;
