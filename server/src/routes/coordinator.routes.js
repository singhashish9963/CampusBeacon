// src/routes/coordinator.routes.js
import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
// import filterInputMiddleware from "../middlewares/filter.middleware.js"; 

import {
  createCoordinator,
  getAllCoordinators,
  getCoordinatorById,
  updateCoordinator,
  deleteCoordinator,
} from "../controllers/coordinator.controller.js";

const router = express.Router();


// Coordinator routes
router.post(
  "/coordinators",
  authMiddleware,
  upload.array("images", 5),
  createCoordinator 
);
router.get("/coordinators", getAllCoordinators);
router.get("/coordinators/:id", getCoordinatorById);

router.put(
  "/coordinators/:id",
  authMiddleware,
  upload.array("images", 5),
  updateCoordinator
);
router.delete("/coordinators/:id", authMiddleware, deleteCoordinator);

export default router;
