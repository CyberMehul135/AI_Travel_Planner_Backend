import axios from "axios";
import {
  AI_RECOMMENDED_TRIP_SYSTEM_PROMPT,
  TRIP_SYSTEM_PROMPT,
} from "../ai/prompts/trip.prompt.js";
import { ApiError } from "../../shared/utils/ApiError.js";

export const generateTripFromUserInputOpenRouter = async (userPrompt, model) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: model,
        messages: [
          {
            role: "system",
            content: TRIP_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.data?.choices || response.data.choices.length === 0) {
      throw new ApiError(502, "Invalid AI response: choices missing from OpenRouter",
        "AI service returned an unexpected response. Please try again.")
    }

    return response.data.choices[0].message.content;
  } catch (err) {
    // Return ApiError directly if it's already an ApiError
    if (err instanceof ApiError) {
      throw err;
    }

    let statusCode = 500;
    let message = "AI service failed";
    let status = "UNKNOWN";

    // OpenRouter specific parsing
    if (err.response?.data?.error) {
      const apiError = err.response.data.error;

      statusCode = apiError.code || err.response.status || 500;
      message = apiError.message || message;

      // getting data from metadata
      if (apiError.metadata?.raw) {
        message = apiError.metadata.raw;
      }

      status = apiError.metadata?.provider_name || "OPENROUTER";
    }

    // Axios fallback
    else if (err.response) {
      statusCode = err.response.status || 500;
      message = err.response.statusText || message;
    }

    // Normal JS error fallback
    else if (err.message) {
      message = err.message;
    }

    const errors = [
      {
        provider: "openrouter",
        statusCode,
        status,
      },
    ];
    let clientMessage = "Failed to generate trip";

    // Lowercase message for checking
    const lowerMessage = message.toLowerCase();

    // High demand / overloaded / unavailable
    if (
      statusCode === 503 ||
      lowerMessage.includes("high demand") ||
      lowerMessage.includes("overloaded") ||
      lowerMessage.includes("unavailable") ||
      lowerMessage.includes("busy")
    ) {
      clientMessage =
        "AI service is busy right now. Please try again later.";
    }

    // Rate limit / quota exceeded
    if (
      statusCode === 429 ||
      lowerMessage.includes("quota") ||
      lowerMessage.includes("rate limit") ||
      lowerMessage.includes("too many requests") ||
      lowerMessage.includes("credits") ||
      lowerMessage.includes("usage limit")
    ) {
      clientMessage =
        "AI request limit reached. Please try again later.";
    }

    throw new ApiError(statusCode, message, clientMessage, errors);
  }
};

export const generateAiRecommendedTripOpenRouter = async (model) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: model,
        messages: [
          {
            role: "system",
            content: AI_RECOMMENDED_TRIP_SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: "Generate recommended trips",
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.data?.choices || response.data.choices.length === 0) {
      throw new ApiError(502, "Invalid AI response: choices missing from OpenRouter",
        "AI service returned an unexpected response. Please try again.")
    }

    return response.data.choices[0].message.content;
  } catch (err) {
    // Return ApiError directly if it's already an ApiError
    if (err instanceof ApiError) {
      throw err;
    }

    let statusCode = 500;
    let message = "AI service failed";
    let status = "UNKNOWN";

    // OpenRouter specific parsing
    if (err.response?.data?.error) {
      const apiError = err.response.data.error;

      statusCode = apiError.code || err.response.status || 500;
      message = apiError.message || message;

      // getting data from metadata
      if (apiError.metadata?.raw) {
        message = apiError.metadata.raw;
      }

      status = apiError.metadata?.provider_name || "OPENROUTER";
    }

    // Axios fallback
    else if (err.response) {
      statusCode = err.response.status || 500;
      message = err.response.statusText || message;
    }

    // Normal JS error fallback
    else if (err.message) {
      message = err.message;
    }

    const errors = [
      {
        provider: "openrouter",
        statusCode,
        status,
      },
    ];
    let clientMessage = "Failed to generate trip";

    // Lowercase message for checking
    const lowerMessage = message.toLowerCase();

    // High demand / overloaded / unavailable
    if (
      statusCode === 503 ||
      lowerMessage.includes("high demand") ||
      lowerMessage.includes("overloaded") ||
      lowerMessage.includes("unavailable") ||
      lowerMessage.includes("busy")
    ) {
      clientMessage =
        "AI service is busy right now. Please try again later.";
    }

    // Rate limit / quota exceeded
    if (
      statusCode === 429 ||
      lowerMessage.includes("quota") ||
      lowerMessage.includes("rate limit") ||
      lowerMessage.includes("too many requests") ||
      lowerMessage.includes("credits") ||
      lowerMessage.includes("usage limit")
    ) {
      clientMessage =
        "AI request limit reached. Please try again later.";
    }

    throw new ApiError(statusCode, message, clientMessage, errors);
  }
};
