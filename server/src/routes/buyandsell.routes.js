import express from "express";
import multer from "multer";
import {
  createBuyAndSellItem,
  updateBuyAndSellItem,
  deleteBuyAndSellItem,
  getBuyAndSellItem,
  getAllBuyAndSellItems,
  getUserItems,
  searchBuyAndSellItems,
} from "../controllers/buyandsell.controller.js"


const router = express.Router();


const upload = multer({ dest: "uploads/" });




router.post("/create-item", upload.single("image"), createBuyAndSellItem);
router.put("/update-item/:id", upload.single("image"), updateBuyAndSellItem);
router.delete("/delete-item/:id", deleteBuyAndSellItem);
router.get("/get-item/:id", getBuyAndSellItem);
router.get("/get-all-item", getAllBuyAndSellItems);
router.get("/user-/:registration_number", getUserItems);
router.get("/search-item", searchBuyAndSellItems);

export default router;
