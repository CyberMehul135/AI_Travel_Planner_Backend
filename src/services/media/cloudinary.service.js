import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

dotenv.config({ quiet: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const directUploadOnCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) {
      throw new Error("Image URL is required");
    }

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "ai-travel-planner",
    });

    if (!result || !result.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    return result;
  } catch (err) {
    console.error("Cloudinary Error:", err.message);
    throw new Error("Image upload failed");
  }
};

export const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) {
      throw new Error("File path is required");
    }

    const result = await cloudinary.uploader.upload(filepath, {
      folder: "ai-travel-planner/users",
    });

    // Temp file delete
    fs.unlinkSync(filepath);

    return result;
  } catch (err) {
    console.error("Cloudinary Upload Error: ", err.message);

    // Temp file delete
    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    throw new Error("Image upload failed");
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete error", err);
  }
};
