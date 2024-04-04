import express from "express";
import {
  deleteProduct,
  getAllProduct,
  getProductById,
  insertProduct,
  updateProduct,
} from "../controllers/product.controller";
const router = express.Router();
import authJwtMiddleware from "../middlewares/auth";
import requireAdmin from "../middlewares/require-admin";

router.route("/").get(getAllProduct);
router.route("/:id").get(getProductById);
router.route("/").post(authJwtMiddleware, requireAdmin, insertProduct);
router.route("/:id").delete(authJwtMiddleware, requireAdmin, deleteProduct);
router.route("/:id").put(authJwtMiddleware, requireAdmin, updateProduct);

export default router;
