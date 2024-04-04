import { Model, Document } from "mongoose";

export interface Cart {
  product: string;
  email: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface CartDocument extends Cart, Document {
  matchPassword: (password: string) => Promise<Boolean>;
}

export interface CartModel extends Model<CartDocument> {}
