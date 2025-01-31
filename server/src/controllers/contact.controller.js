import { Contact } from "../models/contact.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

export const createContacts = asyncHandler(async (req, res) => {
    const { name, email, phone, designation, image_url } = req.body;

    if (!name?.trim()) {
        throw new ApiError("Name is required", 400);
    }

    if (!designation?.trim()) {
        throw new ApiError("Designation is required", 400);
    }

    const newContact = await Contact.create({
        name,
        email,
        phone,
        designation,
        image_url
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newContact,
                "Contact created successfully"
            )
        );
});

export const editContact = asyncHandler(async (req,res)=>{
    const {id}= req.params;
    const {name, email, phone, designation, image_url}= req.body
    
    
})