import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "./asyncHandler.js";
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret:
    process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = asyncHandler(async (localFilePath) => {
  if (!localFilePath) {
    console.log("No file path provided");
    return null;
  }

  console.log("Attempting to upload file:", localFilePath);

  const result = await cloudinary.uploader.upload(localFilePath, {
    resource_type: "auto",
  });

  console.log("Cloudinary upload successful:", result.secure_url);

  fs.unlink(localFilePath, (err) => {
    if (err) console.error("Error deleting file:", err);
  });

  return result.secure_url;
});
