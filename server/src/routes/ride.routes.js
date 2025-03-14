import express from "express";
import {
  createRide,
  getRide,
  getAllRides,
  updateRide,
  deleteRide,
  getUserRides,
} from "../controllers/ride.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import filterInputMiddleware from "../middlewares/filter.middleware.js";

const router = express.Router();

// The order of routes is important - more specific routes first
router.get("/", authMiddleware, getAllRides);
router.get("/user/rides", authMiddleware, getUserRides);
router.get("/user/:userId/rides", authMiddleware, getUserRides);
router.get("/:id", authMiddleware, getRide);
router.post("/", authMiddleware, filterInputMiddleware, createRide);
router.put("/:id", authMiddleware, filterInputMiddleware, updateRide);
router.delete("/:id", authMiddleware, deleteRide);

export default router;
