import users from "../models/user.model";
import ApiResponse from "../utils/apiResponse";

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
    if(!name) return new ApiResponse(400,"name is required");
    if(!registration_number) return new ApiResponse(400,"registration is required");
    if(!name) return new ApiResponse(400,"name is required");
    if(!name) return new ApiResponse(400,"name is required");
    if(!name) return new ApiResponse(400,"name is required");
    if(!name) return new ApiResponse(400,"name is required");





}