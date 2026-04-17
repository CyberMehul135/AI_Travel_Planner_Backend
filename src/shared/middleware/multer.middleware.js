import multer from "multer";
import path from "path";
import { TEMP_UPLOAD_PATH } from "../../config/path.config.js";

// Storage ( No Temporary local storage )
const storage = multer.memoryStorage();

// File Filter ( Only Images Allowed )
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer Instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
