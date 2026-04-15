import successResponse from "../../shared/utils/successResponse.js";
import { AI_MODELS } from "./ai.constants.js";

export const getAIModels = (req, res) => {
  return successResponse(res, 200, "AI Models fetched successfully", {
    AI_MODELS,
  });
};
