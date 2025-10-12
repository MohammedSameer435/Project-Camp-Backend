
import {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  refreshAccessToken,
  registeruser,
  resendEmailVerification,
  resetPassword,
  verifyEmail,
  login,
  logoutuser
} from "../controllers/authcontroller.js"

import { Router } from "express"

import { validate } from "../middlewares/validator.middleware.js"
import {
  forgotpasswordvalidator,
  userChangeCUrrentPasswordValidator,
  userloginvalidator,
  userRegisterValidator
} from "../validators/index.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registeruser)

router.route("/login").post(userloginvalidator(), validate, login)
router.route("/verify-email/:verificationToken").get(verifyEmail)
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(forgotpasswordvalidator(), validate, forgotPasswordRequest)
router.route("/reset-password/:resetToken").post(forgotpasswordvalidator(), validate, resetPassword)

// secured routes
router.route("/logout").post(verifyJWT, logoutuser)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/change-password").post(
  verifyJWT,
  userChangeCUrrentPasswordValidator(),
  validate,
  changeCurrentPassword
);

router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification)

export default router
