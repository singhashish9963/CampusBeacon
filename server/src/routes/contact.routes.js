import express from "express"
import { createContacts,
    editContact,
    deleteContact,
    getContact,
    getAllContacts
 } from "../controllers/contact.controller.js"




 const router=express.Router();

 router.post("create-contact",createContacts)
 router.put("/edit-contact:id",editContact)
 router.delete("/delete-contact:id",deleteContact)
 router.get("/get-contact:id",getContact);
 router.get("/get-allcontact", getAllContacts);
 


 export default router;
