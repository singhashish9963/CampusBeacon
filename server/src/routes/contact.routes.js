import express from "express";
import {
  createContacts,
  editContact,
  deleteContact,
  getContact,
  getAllContacts,
} from "../controllers/contact.controller.js";
import { upload } from "../middlewares/multer.middleware.js"; 
import authMiddleware from "../middlewares/auth.middleware.js"
const router = express.Router();

router.post("/contacts", upload.single("image"), createContacts);
router.put("/contacts/:id", upload.single("image"), editContact);
router.delete("/contacts/:id", deleteContact);
router.get("/contacts/:id", getContact);
router.get("/contacts",authMiddleware, getAllContacts);

export default router;
