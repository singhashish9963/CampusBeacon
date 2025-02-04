import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "./asyncHandler.js";
import fs from "fs"
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dmvsj5vla",
  api_key: process.env.CLOUDINARY_API_KEY || "957488376714669",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "3_3dj13Z4ecrKUAD14y3FLVOVR0",
});

export const uploadImageToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided");
      return null;
    }

    console.log("Attempting to upload file:", localFilePath);

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("Cloudinary upload successful:", result);
    fs.unlinkSync(localFilePath);

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};