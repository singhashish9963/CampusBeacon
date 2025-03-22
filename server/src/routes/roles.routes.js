import express from "express";
import {
  createRole,
  assignRole,
  removeRole,
} from "../controllers/role.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/roles", authMiddleware, createRole);
router.post("/roles/assign", authMiddleware, assignRole);
router.post("/roles/remove", authMiddleware, removeRole);

export default router;
