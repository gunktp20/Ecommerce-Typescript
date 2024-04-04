import { model, Schema } from "mongoose";
import mongoose from "mongoose";
import { CartDocument } from "../types/cart";
const ObjectId = mongoose.Schema.Types.ObjectId;
const cartSchema = new Schema(
  {
    product: { type: ObjectId, ref: "products" },
    email: { type: String, required: true },
    quantity: {
      type: Number,
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = model<CartDocument>("carts", cartSchema);
