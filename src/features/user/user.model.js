import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      default: "",
    },
    avtar: {
      type: String,
    },
    avtarId: {
      type: String,
    },
    phone: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "Always exited to Travel",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
