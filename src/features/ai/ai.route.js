import express from "express";
import { getAIModels } from "./ai.controller.js";

const router = express.Router();

router.get("/models", getAIModels);

export default router;
