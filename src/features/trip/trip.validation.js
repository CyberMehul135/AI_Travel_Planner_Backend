import { z } from "zod";

export const generateTripSchema = z.object({
    provider: z.enum(["gemini", "openRouter"], {
        errorMap: () => ({ message: "Invalid Provider" })
    }),
    model: z.string().min(1, "Model is required"),
    userPrompt: z.object({
        destination: z.string().min(1, "Destination is required"),
        travellers: z.number().min(1, "At least 1 traveller required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),
        budget: z.number().min(1, "Budget is required"),
        interests: z.array(z.string()).min(1, "Select at least 1 interest"),
        accomodation: z.string().min(1, "Accommodation is required"),
        transportation: z.string().min(1, "Transportation is required"),
    })
})

export const generateAiRecommendedTripSchema = z.object({
    provider: z.enum(["gemini", "openRouter"], {
        errorMap: () => ({ message: "Invalid Provider" })
    }),
    model: z.string().min(1, "Model is required"),
})

// Activity
const activitySchema = z.object({
    title: z.string().min(1, "Activity title is required"),
    location: z.string().min(1, "Activity location is required"),
    description: z.string().min(1, "Activity description is required"),
    startTime: z.string().min(1, "Start time is required"),
    duration: z.string().min(1, "Duration is required"),
    cost: z.coerce.number().min(0, "Cost must be >= 0"),
});

// Dining
const diningSchema = z.object({
    name: z.string().min(1, "Restaurant name is required"),
    location: z.string().min(1, "Dining location is required"),
    cuisine: z.string().min(1, "Cuisine is required"),
    cost: z.coerce.number().min(0, "Cost must be >= 0"),
    description: z.string().min(1, "Description is required"),
});

// Day
const daySchema = z.object({
    day: z.coerce.number().min(1, "Day must be >= 1"),
    dayTitle: z.string().min(1, "Day title is required"),
    date: z.string().min(1, "Date is required"),
    dailyBudget: z.coerce.number().min(0, "Daily budget must be >= 0"),
    activities: z.array(activitySchema).min(1, "At least 1 activity required"),
    dining: z.array(diningSchema).min(1, "At least 1 dining required"),
});

// Quick Summary
const quickSummarySchema = z.object({
    destination: z.string().min(1, "Destination is required"),
    image: z.string().min(1, "Image is required"),
    totalDays: z.coerce.number().min(1, "Total days must be >= 1"),
    travelers: z.coerce.number().min(1, "At least 1 traveler required"),
    budget: z.coerce.number().min(0, "Budget must be >= 0"),
    bestTimeToVisit: z.string().min(1, "Best time to visit required"),
    tripType: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
});

export const createTripSchema = z.object({
    quickSummary: quickSummarySchema,
    itinerary: z.array(daySchema).min(1, "Itinerary must have at least 1 day"),
});


