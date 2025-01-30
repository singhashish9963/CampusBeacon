import users from "../models/user.model";
import ApiResponse from "../utils/apiResponse";
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createUser= async(req,res)=>{
    const {
    name,
    registration_number,
    semester,
    branch,
    hostel,
    graduation_year,
    } =req.body;

    const semesters = [
        "First",
        "Second",
        "Third",
        "Fourth",
        "Fifth",
        "Sixth",
        "Seventh",
        "Eighth"
    ];
    const branches = [
      "Electronics and Communication Engineering",
      "Computer Science Engineering",
      "Electrical Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Engineering and Computational Mechanics",
      "Chemical Engineering",
      "Material Engineering",
      "Production and Industrial Engineering",
      "Biotechnology",
    ];
    if (!name) return res.status(400).json({ error: "Name is required" });
    if (!registration_number)
      return res.status(400).json({ error: "Registration number is required" });
    if (!semester || !semesters.includes(semester))
      return res.status(400).json({ error: "Valid semester is required" });
    if (!branch || !branches.includes(branch))
      return res.status(400).json({ error: "Valid branch is required" });
    if (!hostel) return res.status(400).json({ error: "Hostel is required" });
    if (!graduation_year)
      return res.status(400).json({ error: "Graduation year is required" });

    try{
        const newUser= new UserActivation({
            name,
            registration_number,
            semester,
            branch,
            hostel,
            graduation_year,
        });
        const savedUser= await newUser.save();
        return res.status(201).json(savedUser);

    } catch(err){
        return res.status(500).json({error:"Error saving user"})
    }
};

export const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
   
    if (!id || !id.trim()) {
        throw new ApiError(400, "User ID is required");
    }


    if ( req.user.id !== id) {
        throw new ApiError(403, "Unauthorized access");
    }

    const user = await users.findByPk(id, {
        attributes: ['id', 'name', 'email','createdAt'], 
        where: { isActive: true }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json({
        success: true,
        data: user,
        message: "User fetched successfully"
    });
});
