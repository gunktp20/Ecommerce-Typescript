import express from "express";
import {
  register,
  login,
  refresh,
  loginWithGoogle,
  sendOTPInEmail,
  verifyEmailWithOTP
} from "../controllers/auth.controller";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/refresh").post(refresh);
router.route("/send-otp/:email").get(sendOTPInEmail);
router.route("/verify/:email").post(verifyEmailWithOTP);

router.route("/google-auth").post(loginWithGoogle);
// router.route("/google-auth/callback").post(googleAuthCallBack);

export default router;
