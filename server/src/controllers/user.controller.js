import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


export const registerUser=asyncHandler(async (req,res)=>{
    const {email,password}= req.body

    const existingUser= await User.findOne({where: {email}})
    if(existingUser) return next(new ApiError("User already exists",400))
    const hashedPassword= await bcrypt.hash(password,10);

    const newUser= await User.create({
        email,
        password:hashedPassword,
    });

    res.status(201).json(new ApiResponse(201,{userId: newUser.id},"User registered succesfully "))
})
