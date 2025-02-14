import express from "express";
import {
  createEatery,
  updateEatery,
  deleteEatery,
  getEatery,
  getAllEateries,
} from "../controllers/eateries.controller.js";
import multer from "multer";

const upload = multer({ dest: "./public/temp" });

const router = express.Router();

router.post("/", upload.single("menuImage"), createEatery);
router.put("/:id", upload.single("menuImage"), updateEatery);
router.delete("/:id", deleteEatery);
router.get("/:id", getEatery);
router.get("/", getAllEateries);

export default router;
