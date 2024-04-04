import { Model, Document } from "mongoose";

export interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface ProductDocument extends Product, Document {
  matchPassword: (password: string) => Promise<Boolean>;
}

export interface ProductModel extends Model<ProductDocument> {}
