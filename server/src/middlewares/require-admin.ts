import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/User";

const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({ email: req?.user?.email });
  if (user?.role !== "admin") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "require admin role !" });
  }
  next();
};

export default requireAdmin;
