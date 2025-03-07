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

// Public routes with auth middleware
router.get("/rides", authMiddleware, getAllRides);
router.get("/rides/:id", authMiddleware, getRide);

// Protected routes with both auth and filter middleware
router.route("/rides").post(authMiddleware, filterInputMiddleware, createRide);

router
  .route("/rides/:id")
  .put(authMiddleware, filterInputMiddleware, updateRide)
  .delete(authMiddleware, deleteRide);

// User specific routes
router.get("/user/rides", authMiddleware, getUserRides);
router.get("/user/:userId/rides", authMiddleware, getUserRides);

export default router;
