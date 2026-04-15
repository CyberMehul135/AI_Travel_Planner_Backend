import express from "express";
import authMiddleware from "../auth/auth.middleware.js";
import {
  generateTrip,
  createTrip,
  getTrips,
  getTrip,
  deleteTrip,
  getTripStats,
  generateAiRecommendedTrip,
} from "./trip.controller.js";

const router = express.Router();

router.post("/generate", generateTrip);
router.post("/recommended", generateAiRecommendedTrip);

router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getTrips);
router.get("/stats", authMiddleware, getTripStats);
router.get("/:id", authMiddleware, getTrip);
router.delete("/:id", authMiddleware, deleteTrip);

export default router;
