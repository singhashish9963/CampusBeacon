import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "./asyncHandler.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = (localFilePath) => {
  return new Promise((resolve, reject) => {
    if (!localFilePath) {
      console.log("No file path provided");
      resolve(null);
      return;
    }

    console.log("Attempting to upload file:", localFilePath);

    cloudinary.uploader
      .upload(localFilePath, {
        resource_type: "auto",
      })
      .then((result) => {
        console.log("Cloudinary upload successful:", result.secure_url);

        // Delete the local file after successful upload
        fs.unlink(localFilePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });

        resolve(result.secure_url);
      })
      .catch((error) => {
        console.error("Upload failed:", error);

        // Try to delete the file even if upload failed
        fs.unlink(localFilePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });

        reject(error);
      });
  });
};
