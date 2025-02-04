import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"


export const registerUser=asyncHandler(async (req,res,next)=>{
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

export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
        return next(new ApiError("Invalid email or password", 400));
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new ApiError("Invalid email or password", 400));
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.status(200).json(new ApiResponse(200, { token }, "Login successful"));
});

