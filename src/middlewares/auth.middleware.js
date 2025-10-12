import { User } from "../models/usersmodel.js";
import { apierror } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    throw new apierror(401, "Unauthorized request. No token provided.");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");

    if (!user) {
      throw new apierror(401, "Invalid access token. User not found.");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new apierror(401, "Invalid or expired access token.");
  }
});
