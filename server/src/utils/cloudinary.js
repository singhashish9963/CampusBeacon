import cloudinary from "cloudinary"
import asyncHandler from "./asyncHandler.js"
import ApiError from "./apiError.js"
import ApiResponse from "./apiResponse.js"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "CampusBeacon",
  api_key: process.env.CLOUDINARY_API_KEY || "356661483266385",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "RwHLc5V-C6mM51D2tHACEdA50fA",
});

export const uploadImageToCloudinary= asyncHandler(async(req,res)=>{
    const result= await cloudinary.v2.uploader.upload(File.path,{
        folder:folderName,
        use_filename: true,
        unique_filename:true,
    })

    if (!result?.secure_url) {
      throw new ApiError(
        "Upload failed",
        500,
        null,
        false,
        "No URL returned from Cloudinary"
      );
    }


    return result.secure_url;
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { url: result.secure_url },
          "Image uploaded successfully"
        )
      );
      

    
})