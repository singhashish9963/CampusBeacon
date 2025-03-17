import express from "express";
import {
  createRide,
  getRide,
  getAllRides,
  updateRide,
  deleteRide,
  getUserRides,
  joinRide,
  unjoinRide, // import the unjoinRide function
} from "../controllers/ride.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import filterInputMiddleware from "../middlewares/filter.middleware.js";

const router = express.Router();

// Existing routes
router.get("/", authMiddleware, getAllRides);
router.get("/user/rides", authMiddleware, getUserRides);
router.get("/user/:userId/rides", authMiddleware, getUserRides);
router.get("/:id", authMiddleware, getRide);
router.post("/", authMiddleware, filterInputMiddleware, createRide);
router.put("/:id", authMiddleware, filterInputMiddleware, updateRide);
router.delete("/:id", authMiddleware, deleteRide);

// New endpoints for joining and cancelling/joining a ride
router.post("/:id/join", authMiddleware, joinRide);
router.delete("/:id/join", authMiddleware, unjoinRide);

export default router;
