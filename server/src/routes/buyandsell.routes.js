import express from "express";
import multer from "multer";
import {
  createBuyAndSellItem,
  updateBuyAndSellItem,
  deleteBuyAndSellItem,
  getBuyAndSellItem,
  getAllBuyAndSellItems,
  getUserItems,
} from "../controllers/buyandsell.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js"


const router = express.Router();


const upload = multer({ dest: "./public/temp" });




router.get("/items",authMiddleware, getAllBuyAndSellItems);
router.get("/items/:id",authMiddleware, getBuyAndSellItem);



router.route("/items")
  .post(upload.single("image"),authMiddleware, createBuyAndSellItem);

router.route("/items/:id")
  .put(upload.single("image"),authMiddleware, updateBuyAndSellItem)
  .delete(authMiddleware,deleteBuyAndSellItem);

router.get("/user/items",authMiddleware, getUserItems); 
router.get("/user/:userId/items",authMiddleware, getUserItems); 

export default router;

