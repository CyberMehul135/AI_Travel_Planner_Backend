import successResponse from "../../shared/utils/successResponse.js";
import Trip from "./trip.model.js";
import dotenv from "dotenv";
import {
  deleteFromCloudinary,
  directUploadOnCloudinary,
} from "../../services/media/cloudinary.service.js";
import { fetchImage } from "../../services/media/unsplash.service.js";
import {
  generateAIRecommendedTrip,
  generateTripAI,
} from "../../services/ai/gemini.service.js";
import {
  generateOpenRouterRecommendedTrip,
  openRouterAPI,
} from "../../services/ai/openRouter.service.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiError } from "../../shared/utils/ApiError.js";

dotenv.config({ quiet: true });

export const generateTrip = asyncHandler(async (req, res) => {
  const { userPrompt, provider, model } = req.body;

  // 1. Generate-Trip with 'Gemini'/'OpenRouter'
  let aiData;
  if (provider === "gemini") {
    aiData = await generateTripAI(JSON.stringify(userPrompt), model);
  } else if (provider === "openRouter") {
    aiData = await openRouterAPI(JSON.stringify(userPrompt), model);
  } else {
    throw new Error("Invalid provider");
  }

  let data = JSON.parse(aiData);

  // 2. Fetch & Add Image with 'Unsplash'
  data.quickSummary.image = await fetchImage(data.quickSummary.destination);

  successResponse(res, 200, "Api worked Successfully", {
    data,
  });
});

export const generateAiRecommendedTrip = asyncHandler(async (req, res) => {
  const { provider, model } = req.body;

  // 1. Generate-Trips with 'Gemini'/'openRouter'
  let aiData;
  if (provider === "gemini") {
    aiData = await generateAIRecommendedTrip(model);
  } else if (provider === "openRouter") {
    aiData = await generateOpenRouterRecommendedTrip(model);
  } else {
    throw new Error("Invalid provider");
  }

  let trips = JSON.parse(aiData);

  // 2. Safety check
  if (!Array.isArray(trips)) {
    throw new Error("AI did not return array");
  }

  // 3. Fetch & Add Images with 'Unsplash'
  for (let trip of trips) {
    trip.quickSummary.image = await fetchImage(trip.quickSummary.destination);
  }

  successResponse(res, 200, "Recommended trips fetched", { trips });
});

export const createTrip = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { quickSummary, itinerary } = req.body;

  // 1. validate

  // 2 upload to cloudinary
  const image = await directUploadOnCloudinary(quickSummary.image);

  // 3. create & save data
  const newTrip = new Trip({
    userId,
    quickSummary: {
      destination: quickSummary.destination,
      totalDays: quickSummary.totalDays,
      travelers: quickSummary.travelers,
      budget: quickSummary.budget,
      bestTimeToVisit: quickSummary.bestTimeToVisit,
      tripType: quickSummary.tripType,
      image: image.secure_url,
      imageId: image.public_id,
      startDate: quickSummary.startDate,
      endDate: quickSummary.endDate,
    },
    itinerary,
  });
  const saveTrip = await newTrip.save();

  successResponse(res, 201, "Trip created successfully", {
    trip: saveTrip,
  });
});

export const getTrips = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const trips = await Trip.find({ userId });

  successResponse(res, 200, "Trip data fetched successfully", {
    data: trips,
  });
});

export const getTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Find Trip
  const trip = await Trip.findById(id);

  // 2. Check availablity
  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  successResponse(res, 200, "Fetched travel plan successfully", {
    trip,
  });
});

export const deleteTrip = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Find Document(Trip)
  const trip = await Trip.findById(id);

  // 1.1 Check availablity
  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  // 2. Delete from Cloudinary
  await deleteFromCloudinary(trip.quickSummary.imageId);

  // 3. Delete from DB
  await trip.deleteOne();

  successResponse(res, 200, "Trip deleted successfully");
});

export const getTripStats = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  const today = new Date();

  // Total-trips
  const totalTrips = await Trip.countDocuments({ userId });

  // Upcoming-trips
  const upcomingTrips = await Trip.countDocuments({
    userId,
    "quickSummary.startDate": { $gt: today.toISOString() },
  });

  // Past-trips
  const pastTrips = await Trip.countDocuments({
    userId,
    "quickSummary.endDate": { $lt: today.toISOString() },
  });

  successResponse(res, 200, "Trip stats fetched successfully", {
    totalTrips,
    upcomingTrips,
    pastTrips,
    aiRequestsLeft: "∞",
  });
});
