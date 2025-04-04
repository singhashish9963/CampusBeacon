import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "./asyncHandler.js";
import fs from "fs";
import fsPromises from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const LARGE_FILE_THRESHOLD_BYTES = 95 * 1024 * 1024;
const DEFAULT_CHUNK_SIZE_BYTES = 20 * 1024 * 1024;

export const uploadImageToCloudinary = (localFilePath, options = {}) => {
  return new Promise(async (resolve, reject) => {
    if (!localFilePath) {
      console.log("No file path provided");
      resolve(null);
      return;
    }

    const cleanupLocalFile = (path) => {
      fs.unlink(path, (err) => {
        if (err) {
          console.error(`Error deleting local file ${path}:`, err);
        } else {
          console.log(`Local file deleted successfully: ${path}`);
        }
      });
    };

    try {
      const stats = await fsPromises.stat(localFilePath);
      const fileSize = stats.size;
      console.log(`File size for ${localFilePath}: ${fileSize} bytes`);

      let result;

      if (fileSize < LARGE_FILE_THRESHOLD_BYTES) {
        console.log(`Using standard upload for ${localFilePath}`);
        result = await cloudinary.uploader.upload(localFilePath, {
          resource_type: "auto",
          ...options,
        });
        console.log("Cloudinary standard upload successful:", result.secure_url);
      } else {
        console.log(`Using large file upload (chunked) for ${localFilePath}`);
        result = await new Promise((resolveUploadLarge, rejectUploadLarge) => {
          const uploadOptions = {
            resource_type: "auto",
            chunk_size: options.chunk_size || DEFAULT_CHUNK_SIZE_BYTES,
            ...options,
          };
          delete uploadOptions.chunk_size_passed_in_options;

          cloudinary.uploader.upload_large(
            localFilePath,
            uploadOptions,
            (error, uploadResult) => {
              if (error) {
                console.error(
                  `Large file upload failed for ${localFilePath}:`,
                  error
                );
                rejectUploadLarge(error);
              } else {
                console.log(
                  `Large file upload successful for ${localFilePath}:`,
                  uploadResult.secure_url
                );
                resolveUploadLarge(uploadResult);
              }
            }
          );
        });
      }

      cleanupLocalFile(localFilePath);
      resolve(result.secure_url);
    } catch (error) {
      console.error(`Upload process failed for ${localFilePath}:`, error);
      if (fs.existsSync(localFilePath)) {
        cleanupLocalFile(localFilePath);
      }
      reject(error);
    }
  });
};

export const deleteImageFromCloudinary = asyncHandler(async (imageUrl) => {
  if (!imageUrl) {
    return null;
  }

  try {
    const urlParts = imageUrl.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExtension.split(".")[0];

    const uploadIndex = urlParts.indexOf("upload");
    let publicIdToDestroy = "";
    if (uploadIndex !== -1 && uploadIndex < urlParts.length - 2) {
      const relevantParts = urlParts.slice(
        uploadIndex + (urlParts[uploadIndex + 1].match(/^v\d+$/) ? 2 : 1)
      );
      publicIdToDestroy = relevantParts.join("/").split(".")[0];
    } else {
      publicIdToDestroy = publicId;
    }

    if (!publicIdToDestroy) {
      console.log("Could not extract public_id from URL:", imageUrl);
      return false;
    }

    console.log(
      "Attempting to delete Cloudinary image with public_id:",
      publicIdToDestroy
    );
    const result = await cloudinary.uploader.destroy(publicIdToDestroy);

    if (result.result === "ok") {
      console.log("Image deleted successfully from Cloudinary");
      return true;
    } else if (result.result === "not found") {
      console.log(
        "Image not found on Cloudinary (perhaps already deleted):",
        publicIdToDestroy
      );
      return true;
    } else {
      console.log("Failed to delete image from Cloudinary:", result);
      return false;
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return false;
  }
});

export const extractCloudinaryPublicId = (url) => {
  try {
    const uploadMarker = "/upload/";
    const startIndex = url.indexOf(uploadMarker);
    if (startIndex === -1) return null;

    let pathPart = url.substring(startIndex + uploadMarker.length);
    pathPart = pathPart.replace(/^v\d+\//, "");

    const lastDotIndex = pathPart.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      return pathPart.substring(0, lastDotIndex);
    } else {
      return pathPart;
    }
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};
