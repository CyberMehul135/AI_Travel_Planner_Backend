import axios from "axios";
import User from "../user/user.model.js";
import jwt from "jsonwebtoken";
import successResponse from "../../shared/utils/successResponse.js";
import config from "../../config/env.config.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

export const googleAuthRedirect = asyncHandler(async (req, res) => {
  const { redirect } = req.query;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${config.BACKEND_URL}/api/v1/auth/google/callback&response_type=code&scope=profile email&state=${redirect || "/"}`;

  res.redirect(googleAuthUrl);
});

export const googleAuthCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  if (!code) {
    return res.status(400).send("Authorization code not provided");
  }

  // 1. Exachange code for Google-Access-Token
  let accessToken;

  const params = new URLSearchParams();
  params.append("client_id", process.env.GOOGLE_CLIENT_ID);
  params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append(
    "redirect_uri",
    `${config.BACKEND_URL}/api/v1/auth/google/callback`,
  );

  const tokenResponse = await axios.post(
    "https://oauth2.googleapis.com/token",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  accessToken = tokenResponse.data.access_token;

  // 2. Fetch Google-UserData
  const googleUserResponse = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const googleUser = googleUserResponse.data;

  // 3. Find & Save user
  let user = await User.findOne({ email: googleUser.email });
  if (!user) {
    user = await User.create({
      name: googleUser.name,
      email: googleUser.email,
      avtar: googleUser.picture,
    });

    await user.save();
  }

  // 4. Create JWT-Token
  const jwtToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  // 5. Send JWT-Token
  res.cookie("jwtToken", jwtToken, {
    httpOnly: true,
    secure: true, // Local : false  // Production : true
    sameSite: "none", // Local : "lax"  // Production : "none"
    path: "/",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  const redirectUrl = state || "/";
  return res.redirect(`${config.FRONTEND_URL}${redirectUrl}`);
});

export const verifySession = asyncHandler(async (req, res) => {
  successResponse(res, 200, "Authenticated user", { user: req.user });
});

export const logoutUser = asyncHandler(async (req, res) => {
  // 1. Token Delete From Cookie
  res.clearCookie("jwtToken", {
    httpOnly: true,
    secure: true, // in, production : true
    sameSite: "none", // if cross-origin hai
  });

  // 2. give response
  return successResponse(res, 200, "Logged out successfully.");
});
