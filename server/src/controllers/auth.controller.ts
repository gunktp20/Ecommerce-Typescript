import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { OAuth2Client } from "google-auth-library";
import "express-async-errors";
import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index";
import validator from "validator";
import jwt, { JwtPayload } from "jsonwebtoken";
import transporter from "../utils/transporter";
import { FORM_VERIFY_EMAIL } from "../utils/emailVerification";
import User from "../models/User";
import UserVerification from "../models/UserVerification";
import { RandomOTP, checkExpried } from "../utils";
import bcrypt from "bcrypt";

interface IJwtPayload extends JwtPayload {
  email: string;
}

const sendOTPInEmail = async (req: Request, res: Response) => {
  let expiresIn = new Date();
  expiresIn.setMinutes(expiresIn.getMinutes() + 15);
  const OTP = await RandomOTP();
  if (!validator.isEmail(req.params.email)) {
    throw new BadRequestError("Invalid E-mail formatt");
  }
  const user = await User.findOne({
    email: req.params.email,
  });
  if (!user) {
    const newUser = await User.create({
      email: req.params.email,
      otpExpiresIn: expiresIn,
      OTP,
    });
    await transporter.sendMail({
      from: "arrliver@gmail.com",
      to: req.params.email,
      html: FORM_VERIFY_EMAIL(newUser.OTP),
    });
    return res.status(StatusCodes.OK).json({ msg: "Sent e-mail verification" });
  }
  if (user && user?.verified) {
    throw new BadRequestError("User is already verified");
  }
  if (user && !user?.verified) {
    await User.findOneAndUpdate(
      { email: req.params.email },
      { OTP: OTP, otpExpiresIn: expiresIn }
    );
    await transporter.sendMail({
      from: "arrliver@gmail.com",
      to: req.params.email,
      html: FORM_VERIFY_EMAIL(OTP),
    });
    return res.status(StatusCodes.OK).json({ msg: "Sent e-mail verification" });
  }
};

const verifyEmailWithOTP = async (req: Request, res: Response) => {
  const { email } = req.params;
  if (!email) {
    throw new BadRequestError("Please provide an email");
  }
  const { OTP } = req.body;
  if (!OTP) {
    throw new BadRequestError("Please provide an OTP");
  }
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new BadRequestError(`Not found your account`);
  }

  if (user.verified) {
    throw new BadRequestError(`E-mail was verified`);
  }

  const isExpired = await checkExpried(user.otpExpiresIn);
  if (isExpired) {
    throw new BadRequestError(`Your OTP was expired`);
  }

  const isOTPValid = await user.verifyOTP(OTP);
  if (!isOTPValid) {
    throw new UnAuthenticatedError(`Your OTP is not valid`);
  }
  user.verified = true;
  await user.save();
  const token = jwt.sign({ email }, process.env.JWT_EMAIL_VERIFIED as string, {
    expiresIn: "5m",
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: "Verified E-mail successfully", token: token });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all value");
  }

  if (!validator.isEmail(email)) {
    throw new BadRequestError("Invalid E-mail format");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError(`Not found your account`);
  }
  if (user?.accountType === "google") {
    throw new BadRequestError(`This account was registered with Google service`);
  }
  if (!user.verified) {
    throw new BadRequestError(`Please verify your E-mail first`);
  }
  const isPasswordCorrect = await user?.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("password is not correct");
  }

  res.status(StatusCodes.OK).json({
    user,
    accessToken: user?.createAccessToken(),
    refreshToken: user?.createRefreshToken(),
  });
};

const checkIsAdmin = async (req: Request, res: Response) => {
  console.log("checkIsAdmin")
  const isAdmin = await User.findOne({
    email: req?.user?.email,
    role: "admin",
  });
  if (!isAdmin) {
    throw new UnAuthenticatedError("Your are not admin role");
  }

  res.status(StatusCodes.OK).json({ msg: "your are admin" });
};

const refresh = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const { email } = jwt.verify(
      token,
      process.env.JWT_SECRET_REFRESH as string
    ) as IJwtPayload;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new NotFoundError("Not Found your account!");
    }

    res.status(StatusCodes.OK).json({
      user,
      accessToken: user?.createAccessToken(),
      refreshToken: user?.createRefreshToken(),
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};

const loginWithGoogle = async (req: Request, res: Response) => {
  const { tokens } = req?.body;
  const redirectURL = "http://127.0.0.1:5000/auth/google-auth/callback";
  const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectURL
  );
  await oAuth2Client.setCredentials(tokens);
  const data = await getUserData(
    oAuth2Client.credentials.access_token as string
  );
  const user = await User.findOne({ email: data?.email });
  if (!user) {
    const newUser = await User.create({
      email: data?.email,
      verified: true,
      accountType: "google",
      profileURL: data?.picture,
    });
    return res.status(StatusCodes.OK).json({
      user: newUser,
      accessToken: newUser?.createAccessToken(),
      refreshToken: newUser?.createRefreshToken(),
    });
  }
  if (user?.verified && user?.accountType === "email") {
    throw new BadRequestError(
      "E-mail that you provide was already in used , Please try other account"
    );
  }
  if (!user?.verified && user?.accountType === "email") {
    const updatedUser = await User.findOneAndUpdate(
      { email: data?.email },
      { verified: true, accountType: "google", profileURL: data?.picture }
    );
    return res.status(StatusCodes.OK).json({
      user: updatedUser,
      accessToken: updatedUser?.createAccessToken(),
      refreshToken: updatedUser?.createRefreshToken(),
    });
  }

  res.status(StatusCodes.OK).json({
    user,
    accessToken: user?.createAccessToken(),
    refreshToken: user?.createRefreshToken(),
  });
};

export {
  login,
  refresh,
  loginWithGoogle,
  sendOTPInEmail,
  verifyEmailWithOTP,
  checkIsAdmin,
};

const getUserData = async (access_token: string) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );

  const data = await response.json();
  return data;
};
