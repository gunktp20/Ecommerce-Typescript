import { model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { UserDocument } from "../types/user.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [false, "Please provide email"],
    unique: true,
    validate: [validator.isEmail],
    maxlength: 30,
    trim: true,
  },
  password: {
    type: String,
    // required: [false, "Please provide password"],
    required: false,
    minlength: [6, "password must contain more than 6 letter "],
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
  profileURL: {
    type: String,
    required: false,
  },
  accountType: {
    type: String,
    enum: ["google", "email"],
    default: "email",
    require: true,
  },
  itemsInCart: [{ type: ObjectId, ref: "carts" }],
});

// UserSchema.pre("save", async function () {
//   console.log(this.modifiedPaths());
//   if (!this.isModified("password")) return;
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

UserSchema.methods.createAccessToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role, phoneNumber: this.phoneNumber },
    process.env.JWT_SECRET_ACCESS as string,
    {
      expiresIn: "60m",
    }
  );
};

UserSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role, phoneNumber: this.phoneNumber },
    process.env.JWT_SECRET_REFRESH as string,
    {
      expiresIn: "1d",
    }
  );
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export default model<UserDocument>("users", UserSchema);
