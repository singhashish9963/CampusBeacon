import express from "express";
import { createContacts, editContact, deleteContact, getContact, getAllContacts } from "../controllers/contact.controller.js";
import multer from "multer";

const upload = multer({ dest: 'uploads/' }); // Define the upload middleware

const router = express.Router();

router.post("/create-contact", upload.single('image'), createContacts);
router.put("/edit-contact/:id", editContact);
router.delete("/delete-contact/:id", deleteContact);
router.get("/get-contact/:id", getContact);
router.get("/get-allcontacts", getAllContacts);

export default router;
