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



router.use(authMiddleware)
router.get("/items", getAllBuyAndSellItems);
router.get("/items/:id", getBuyAndSellItem);



router.route("/items")
  .post(upload.single("image"), createBuyAndSellItem);

router.route("/items/:id")
  .put(upload.single("image"), updateBuyAndSellItem)
  .delete(deleteBuyAndSellItem);

router.get("/user/items", getUserItems); 
router.get("/user/:userId/items", getUserItems); 

export default router;

