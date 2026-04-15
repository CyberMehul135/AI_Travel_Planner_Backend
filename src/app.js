import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({ quiet: true });

const app = express();
const corsOptions = {
  origin: config.FRONTEND_URL,
  credentials: true,
};

// Middlewares
app.use(express.json()); // to parse JSON-data
app.use(cookieParser()); // to read cookie from req(frontend)
app.use(cors(corsOptions));

// Import Router files
import tripRouter from "./features/trip/trip.route.js";
import authRouter from "./features/auth/auth.route.js";
import userRouter from "./features/user/user.route.js";
import aiRouter from "./features/ai/ai.route.js";
import config from "./config/env.config.js";
import errorHandler from "./shared/middleware/error.middleware.js";

// Use Router files
app.use("/api/v1/itinery", tripRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/ai", aiRouter);

// Global Error handler
app.use(errorHandler);

export default app;
