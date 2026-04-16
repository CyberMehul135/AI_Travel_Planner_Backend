import express from "express";
import authMiddleware from "../auth/auth.middleware.js";
import { getUserDetails, updateUserDetails } from "./user.controller.js";
import { upload } from "../../shared/middleware/multer.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getUserDetails);
router.put("/me", authMiddleware, upload.single("avtar"), updateUserDetails);

export default router;
