import { Model, Document } from "mongoose";

export interface UserVerification {
  email: string;
  OTP: string;
  expiresIn: Date;
  verified: boolean;
}

export interface UserVerificationDocument extends UserVerification, Document {
  verifyOTP: (OTP: string) => Promise<Boolean>;
}

export interface UserVerificationModel
  extends Model<UserVerificationDocument> {}
