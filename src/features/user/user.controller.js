import User from "./user.model.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/utils/successResponse.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../../services/media/cloudinary.service.js";
import { updateProfileSchema } from "./user.validation.js";

export const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  res.status(200).json({ message: "User Authenticated", user });
});

export const updateUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.user;

  // 1. zod validation
  const result = updateProfileSchema.safeParse(req.body)
  if (!result.success) {
    const errors = result.error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message
    }));

    throw new ApiError(400, "Validation failed", "Validation failed", errors)
  }

  // 2. Safe data
  const validatedData = result.data;

  // 3. Find User
  let user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 4. Update Cloudinary
  if (req.file) {
    // Image Delete
    if (user.avtarId) {
      await deleteFromCloudinary(user.avtarId);
    }

    // Image Upload
    const image = await uploadOnCloudinary(req.file);

    validatedData.avtar = image.secure_url;
    validatedData.avtarId = image.public_id;
  }

  // 5. Update DB
  const updatedUser = await User.findByIdAndUpdate(userId, validatedData, {
    returnDocument: "after",
  });

  successResponse(res, 200, "User updated successfully", { updatedUser });
});
