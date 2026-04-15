import express from "express";
import authMiddleware from "./auth.middleware.js";
import {
  googleAuthRedirect,
  googleAuthCallback,
  verifySession,
  logoutUser,
} from "./auth.controller.js";

const router = express.Router();

router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);
router.get("/session", authMiddleware, verifySession);
router.post("/logout", authMiddleware, logoutUser);

export default router;
