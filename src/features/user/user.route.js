import express from "express";
import authMiddleware from "../auth/auth.middleware.js";
import { getUserDetails } from "./user.controller.js";

const router = express.Router();

router.get("/me", authMiddleware, getUserDetails);

export default router;
