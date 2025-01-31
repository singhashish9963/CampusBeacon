import { Router } from "express";
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
} from "../controllers/buyandsell.controller.js";
import multer from "multer";
// import authMiddleware from "../middlewares/";

const router = Router();

const upload = multer({ dest: "temp/" });

router.post(
  "/create-list",
  authMiddleware,
  upload.single("image"),
  createListing
);
router.get("/get-list", getListings);
router.get("/get-list-id/:id", getListingById);
router.put(
  "/update-list/:id",
  upload.single("image"),
  updateListing
);
router.delete("/delete-list/:id",  deleteListing);

export default router;
