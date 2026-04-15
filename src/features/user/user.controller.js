import User from "./user.model.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

export const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  res.status(200).json({ message: "User Authenticated", user });
});
