import express from "express";
import {
  login,
  refresh,
  loginWithGoogle,
  sendOTPInEmail,
  verifyEmailWithOTP,
  checkIsAdmin,
} from "../controllers/auth.controller";
import authJwtMiddelware from "../middlewares/auth";

const router = express.Router();

router.route("/login").post(login);
router.route("/checkIsAdmin").get(authJwtMiddelware, checkIsAdmin);
router.route("/refresh").post(refresh);
router.route("/send-otp/:email").get(sendOTPInEmail);
router.route("/verify/:email").post(verifyEmailWithOTP);

router.route("/google-auth").post(loginWithGoogle);

export default router;
