import { UnAuthenticatedError } from "../errors/index";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

interface IJwtPayload extends JwtPayload {
  userId: mongoose.Types.ObjectId;
}
const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const { userId } = (await jwt.verify(
      token,
      process.env.JWT_SECRET_ACCESS as string
    )) as IJwtPayload;
    req.user = {
      userId: userId,
    };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};

export default auth;
