import { model, Schema } from "mongoose";
import validator from "validator";
import { UserVerificationDocument } from "../types/user_verification.model";

const UserVerificationSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    validate: [validator.isEmail],
    trim: true,
  },
  OTP: {
    type: String,
    required: [false, "Please provide OTP"],
    trim: true,
  },
  expiresIn: {
    type: Date,
    required: true,
  },
  verified: {
    type: Boolean,
    require: true,
    default: false,
  },
});

UserVerificationSchema.methods.verifyOTP = async function (OTP: string) {
  const isMatch = OTP === this.OTP;
  return isMatch;
};

export default model<UserVerificationDocument>(
  "users_verifications",
  UserVerificationSchema
);
