import { GoogleGenAI } from "@google/genai";
import {
  AI_RECOMMENDED_TRIP_SYSTEM_PROMPT,
  TRIP_SYSTEM_PROMPT,
} from "./prompts/trip.prompt.js";
import dotenv from "dotenv";
import { ApiError } from "../../shared/utils/ApiError.js";

dotenv.config({ quiet: true });

const API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateTripAI = async (userInput, model) => {
  try {
    const res = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${TRIP_SYSTEM_PROMPT} Generate travel itinerary using this input: ${userInput}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    return res.text;
  } catch (err) {
    console.log("Gemini Error:", err);

    let parsedError = {};

    try {
      parsedError = JSON.parse(err.message);
    } catch {
      parsedError = {};
    }

    const statusCode = parsedError?.error?.code || err?.status || 500;
    const message =
      parsedError?.error?.message || err?.message || "AI service failed";
    const errors = [
      {
        provider: "gemini",
        statusCode,
        status: parsedError?.error?.status || "UNKNOWN",
      },
    ];

    throw new ApiError(statusCode, message, errors);
  }
};

export const generateAIRecommendedTrip = async (model) => {
  try {
    const res = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${AI_RECOMMENDED_TRIP_SYSTEM_PROMPT} `,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    return res.text;
  } catch (err) {
    console.log("Gemini Error:", err);

    let parsedError = {};

    try {
      parsedError = JSON.parse(err.message);
    } catch {
      parsedError = {};
    }

    const statusCode = parsedError?.error?.code || err?.status || 500;
    const message =
      parsedError?.error?.message || err?.message || "AI service failed";
    const errors = [
      {
        provider: "gemini",
        statusCode,
        status: parsedError?.error?.status || "UNKNOWN",
      },
    ];

    throw new ApiError(statusCode, message, errors);
  }
};
