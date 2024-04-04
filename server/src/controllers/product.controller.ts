import { Request, Response } from "express";
import { Product } from "../models/Product";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

const getAllProduct = async (req: Request, res: Response) => {
  const { search, category } = req.query;

  const queryObject: any = {};

  if (search) {
    queryObject.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category && category !== "all") {
    queryObject.category = category;
  }

  const products = await Product.find(queryObject);
  res.status(StatusCodes.OK).json(products);
};

const getProductById = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide product id!" });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide a valid product id" });
  }

  const products = await Product.findById(req.params.id);
  if (!products) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Not found your product with id ${req.params.id}` });
  }
  res.status(StatusCodes.OK).json(products);
};

const insertProduct = async (req: Request, res: Response) => {
  const { name, description, price, category, img } = req.body;
  if (!name || !description || !price || !category || !img) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all value!" });
  }
  const product = await Product.create(req.body);
  res.status(StatusCodes.OK).json(product);
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide product id!" });
  }
  const product = await Product.findById(id);
  if (!product) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Not found your product with ID ${id}` });
  }
  await Product.deleteOne({ _id: id });
  res.status(StatusCodes.OK).json({ msg: "Deleted 1 record!" });
};

const updateProduct = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide product id!" });
  }
  const { name, description, price, category, img } = req.body;
  if (!name || !description || !price || !category || !img) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all value!" });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Not found your product with id ${req.params.id}` });
  }

  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.status(StatusCodes.OK).json({ msg: "Updated 1 record" });
};

export {
  getAllProduct,
  getProductById,
  insertProduct,
  deleteProduct,
  updateProduct,
};
