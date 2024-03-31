import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { OAuth2Client } from "google-auth-library";
import "express-async-errors";
import { BadRequestError, UnAuthenticatedError } from "../errors/index";
import validator from "validator";
import jwt from "jsonwebtoken";
import transporter from "../utils/transporter";
import { FORM_VERIFY_EMAIL } from "../utils/emailVerification";
import User from "../models/User";
import UserVerification from "../models/UserVerification";
import { RandomOTP, checkExpried } from "../utils";

const sendOTPInEmail = async (req: Request, res: Response) => {
  let expiresIn = new Date();
  expiresIn.setMinutes(expiresIn.getMinutes() + 15);
  const OTP = await RandomOTP();

  if (!validator.isEmail(req.params.email)) {
    throw new BadRequestError("Invalid E-mail formatt");
  }

  const emailIsExist = await UserVerification.findOne({
    email: req.params.email,
  });

  if (emailIsExist) {
    const userVerification = await UserVerification.findOneAndUpdate(
      { email: req.params.email },
      { OTP: OTP, expiresIn }
    );
    await transporter.sendMail({
      from: "arrliver@gmail.com",
      to: req.params.email,
      html: FORM_VERIFY_EMAIL(OTP),
    });
    return res.status(StatusCodes.OK).json({ msg: "Sent e-mail verification" });
  }

  const userVerification = await UserVerification.create({
    email: req.params.email,
    expiresIn,
    OTP,
  });

  await transporter.sendMail({
    from: "arrliver@gmail.com",
    to: req.params.email,
    html: FORM_VERIFY_EMAIL(userVerification.OTP),
  });
  res.status(StatusCodes.OK).json({ msg: "Sent e-mail verification" });
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
  const user = await UserVerification.findOne({
    email,
  });

  if (!user) {
    throw new BadRequestError(`Not found your account`);
  }

  if (user.verified) {
    throw new BadRequestError(`E-mail was verified`);
  }

  const isExpired = await checkExpried(user.expiresIn);
  if (isExpired) {
    throw new BadRequestError(`Your OTP was expired`);
  }

  const isOTPValid = await user.verifyOTP(OTP);
  if (!isOTPValid) {
    throw new UnAuthenticatedError(`Your OTP is not valid`);
  }
  user.verified = true;
  await user.save();
  await User.create({ email });
  const token = jwt.sign({ email }, process.env.JWT_EMAIL_VERIFIED as string, {
    expiresIn: "1m",
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: "Verified E-mail successfully", token: token });
};

const register = async (req: Request, res: Response) => {
  // const { firstname, lastname, password, email } = req.body;
  // if (!firstname || !lastname || !password || !email) {
  //   throw new BadRequestError("Please provide all value !");
  // }
  // if (!validator.isEmail(email)) {
  //   throw new BadRequestError("Please provide a valid Email !");
  // }
  // const emailAlreadyExists = await User.findOne({ email });
  // if (emailAlreadyExists) {
  //   throw new BadRequestError("email already in use");
  // }
  // const user = await User.create({
  //   firstname,
  //   lastname,
  //   password,
  //   email,
  // });
  // const accessToken = user?.createAccessToken();
  // const refreshToken = user?.createRefreshToken();
  // res.status(StatusCodes.OK).json({
  //   user: {
  //     _id: user._id,
  //     firstname: user.firstname,
  //     lastname: user.lastname,
  //     email: user.email,
  //     role: user.role,
  //     orderRentedCar: user.orderRentedCar,
  //     phoneNumber: user.phoneNumber,
  //     emailVerified: user.emailVerified,
  //   },
  //   accessToken: accessToken,
  //   refreshToken: refreshToken,
  // });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide all value");
  }

  if (!validator.isEmail(email)) {
    throw new BadRequestError("Invalid E-mail formatt");
  }

  const userVerification = await UserVerification.findOne({ email });

  if (!userVerification) {
    throw new BadRequestError(`Not found your account`);
  }
  if (!userVerification.verified) {
    throw new BadRequestError(`Please verify your E-mail first`);
  }
  const user = await User.findOne({ email });
  res.status(StatusCodes.OK).json({
    user,
    accessToken: user?.createAccessToken(),
    refreshToken: user?.createRefreshToken(),
  });
};

const refresh = (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: "Refresh" });
};

// const loginWithGoogle = (req: Request, res: Response) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Referrer-Policy", "no-referrer-when-downgrade");
//   const redirectURL = "http://127.0.0.1:5000/auth/google-auth/callback";

//   const oAuth2Client = new OAuth2Client(
//     process.env.CLIENT_ID,
//     process.env.CLIENT_SECRET,
//     redirectURL
//   );

//   const authorizeUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: "https://www.googleapis.com/auth/userinfo.profile  openid ",
//     prompt: "consent",
//   });

//   res.json({ url: authorizeUrl });
// };

const loginWithGoogle = async (req: Request, res: Response) => {
  // const code = req.query.code as string;
  // console.log("CODEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", code);
  const { tokens } = req?.body;
  try {
    const redirectURL = "http://127.0.0.1:5000/auth/google-auth/callback";
    // const redirectURL = "http://localhost:5000/auth/google-auth/callback";
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL
    );
    // const r = await oAuth2Client.getToken(code);
    // console.log(
    //   "RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
    //   r.tokens
    // );
    // Make sure to set the credentials on the OAuth2 client.
    await oAuth2Client.setCredentials(tokens);
    // console.info("Tokens acquired.");
    // const user = oAuth2Client.credentials;
    // console.log("credentials", user);
    const data = await getUserData(
      // oAuth2Client.credentials.access_token as string
      oAuth2Client.credentials.access_token as string
    );
    console.log(data);
    const user = await User.findOne({ email: data?.email });
    const userVerification = await UserVerification.findOne({
      email: data?.email,
    });
  
    if (user?.accountType !== "google" && userVerification?.verified) {
      throw new BadRequestError(
        "E-mail that you provide was already in used , Please try other account"
      );
    }

    if (!userVerification?.verified) {
      await UserVerification.findOneAndUpdate(
        {
          email: data?.email,
        },
        { verified: true }
      );
    }

    if(!user && userVerification){
      await UserVerification.findOneAndUpdate(
        {
          email: data?.email,
        },
        { verified: true }
      );
    }

    if(!user && !userVerification){
      const newUser = await User.create({ email:data?.email ,accountType:"google"});
      const accessToken = newUser?.createAccessToken()
      const refreshToken = newUser?.createRefreshToken()
      return res.status(StatusCodes.OK).json({newUser,accessToken,refreshToken})
    }

    if ((user?.accountType !== "google") && (!userVerification?.verified) ) {
      const user = await User.findOneAndUpdate(
        { email: data?.email },
        {
          accountType: "google",
        }
      );
    }


    // const emailAlreadyExists = await User.findOne({ email: data.email });
    // if (!emailAlreadyExists) {
    //   const user = await User.create({})
    // }
  } catch (err) {
    console.log("Error logging in with OAuth2 user", err);
  }

  // res.redirect(303, "http://localhost:5173/");
};

export {
  register,
  login,
  refresh,
  loginWithGoogle,
  // googleAuthCallBack,
  sendOTPInEmail,
  verifyEmailWithOTP,
};

const getUserData = async (access_token: string) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );

  const data = await response.json();
  return data;
};
