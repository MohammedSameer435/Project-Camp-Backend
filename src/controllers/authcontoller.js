
import crypto from "crypto";
import jwt from "jsonwebtoken"
import { User } from "../models/usersmodel.js";
import { APIresponse } from "../utils/api-response.js"
import { apierror } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandler.js"
import { emailverificationcontent, forgotPasswordMailgencontent, sendemail } from "../utils/mail.js"



const generateAccessandRefreshTokens = async (userid) => {
  try {
    const user = await User.findById(userid);
    if (!user) {
      throw new apierror(404, "User not found while generating tokens")
    }
   
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generaterefreshtoken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new apierror(500, "Something went wrong while generating access token")
  }
}
const registeruser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body

  const existeduser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existeduser) {
    throw new apierror(409, "User with given email or username already exists");
  }

  const createdUser = await User.create({
    email,
    password,
    username,
    isEmailVerified: false
  })

  if (!createdUser) {
    throw new apierror(500, "Something went wrong while registering a user");
  }


  const { unhashedtoken, hashedtoken, tokenexpiry } = createdUser.generatetemporarytoken()

  createdUser.emailVerificationToken = hashedtoken
  createdUser.emailVerificationExpiry = tokenexpiry

  await createdUser.save({ validateBeforeSave: false })

  await sendemail({
    email: createdUser.email,
    subject: "Please verify your email",
    mailgenContent: emailverificationcontent(
      createdUser.username,
      `${req.protocol}://${req.get("host")}/api.v1/users/verify-email/${unhashedtoken}`
    )
  })

  
  const sanitizedUser = await User.findById(createdUser._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  )

  return res.status(201).json(
    new APIresponse(
      201,
      { user: sanitizedUser },
      "User registered successfully and verification email has been sent to your email"
    )
  )
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new apierror(400, "Email is required")
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new apierror(400, "User does not exist")
  }
  const ispasswordvalid = await user.isPasswordCorrect(password)
  if (!ispasswordvalid) {
    throw new apierror(400, "Invalid credentials")
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id);

  const loggedinuser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new APIresponse(200, { user: loggedinuser, refreshToken, accessToken }, "User logged in successfully")
    )
})

const logoutuser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: ""
      }
    },
    {
      new: true
    }
  )

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new APIresponse(200, {}, "User logged out"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new APIresponse(200, req.user, "Current user fetched successfully"))
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params

  if (!verificationToken) {
    throw new apierror(400, "Email verification token is missing")
  }

  const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex")

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() }
  })

  if (!user) {
    throw new apierror(400, "Token is invalid or expired")
  }

  user.emailVerificationToken = undefined
  user.emailVerificationExpiry = undefined
  user.isEmailVerified = true

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new APIresponse(200, { isEmailVerified: true }, "Email is verified"))
});

const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id)
  if (!user) {
    throw new apierror(404, "User does not exist")
  }
  if (user.isEmailVerified) {
    throw new apierror(409, "Email is already verified")
  }


  const { unhashedtoken, hashedtoken, tokenexpiry } = user.generatetemporarytoken()

  user.emailVerificationToken = hashedtoken
  user.emailVerificationExpiry = tokenexpiry

  await user.save({ validateBeforeSave: false });

  await sendemail({
    email: user.email,
    subject: "Please verify your email",
    mailgenContent: emailverificationcontent(
      user.username,
      `${req.protocol}://${req.get("host")}/api.v1/users/verify-email/${unhashedtoken}`
    )
  });

  return res.status(201).json(new APIresponse(201, {}, "Mail has been sent to your email ID"))
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new apierror(401, "Unauthorised access")
  }
  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new apierror(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user.refreshToken) {
      throw new apierror(401, "Refresh token is expired")
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    };

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessandRefreshTokens(user._id)

    user.refreshToken = newRefreshToken
    await user.save({ validateBeforeSave: false })

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(new APIresponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"))
  } catch (error) {
    throw new apierror(401, "Invalid refresh token")
  }
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new apierror(404, "User does not exist")
  }

  const { unhashedtoken, hashedtoken, tokenexpiry } = user.generatetemporarytoken();

  user.forgotPasswordToken = hashedtoken;
  user.forgotPasswordExpiry = tokenexpiry;
  await user.save({ validateBeforeSave: false })

  await sendemail({
    email: user.email,
    subject: "Password reset request",
    mailgenContent: forgotPasswordMailgencontent(user.username, `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unhashedtoken}`)
  })

  return res.status(200).json(new APIresponse(200, {}, "Password reset mail has been sent to your mail"))
});

const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params
  const { newPassword } = req.body

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() }
  })

  if (!user) {
    throw new apierror(400, "Token is invalid or expired")
  }

  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;
  user.password = newPassword;
  await user.save({ validateBeforeSave: false })

  return res.status(200).json(new APIresponse(200, {}, "Password reset successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new apierror(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword)
  if (!isPasswordValid) {
    throw new apierror(400, "Invalid old password")
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false })

  return res.status(200).json(new APIresponse(200, {}, "Password changed successfully"))
});

export {
  registeruser,
  login,
  logoutuser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
  forgotPasswordRequest,
  changeCurrentPassword,
  resetPassword
};
