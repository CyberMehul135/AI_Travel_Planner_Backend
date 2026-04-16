import User from "./user.model.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import successResponse from "../../shared/utils/successResponse.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../../services/media/cloudinary.service.js";

export const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  res.status(200).json({ message: "User Authenticated", user });
});

export const updateUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { name, email, phone, location, bio } = req.body;

  // 1. Prepare Updated Object
  const updatedData = {};
  if (name) updatedData.name = name;
  if (phone) updatedData.phone = phone;
  if (location) updatedData.location = location;
  if (bio) updatedData.bio = bio;

  // 2. Find User
  let user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 3. Update Cloudinary
  if (req.file) {
    // Image Delete
    if (user.avtarId) {
      await deleteFromCloudinary(user.avtarId);
    }

    // Image Upload
    const image = await uploadOnCloudinary(req.file.path);

    updatedData.avtar = image.secure_url;
    updatedData.avtarId = image.public_id;
  }

  // 4. Update DB
  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    returnDocument: "after",
  });

  successResponse(res, 200, "User updated successfully", { updatedUser });
});
