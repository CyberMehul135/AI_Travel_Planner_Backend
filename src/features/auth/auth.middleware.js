import jwt from "jsonwebtoken";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { ApiError } from "../../shared/utils/ApiError.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    throw new ApiError(401, "JWT token missing", "Unauthorized access")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid JWT token", "Invalid or expired token")
  }
})

export default authMiddleware;
