import express from "express";
import {
    insertCart,
    getAllCart,
    getAllCartByEmail,
    deleteCartByProductId
} from "../controllers/cart.controller";
const router = express.Router();


router.route("/").get(getAllCart);
router.route("/:email").get(getAllCartByEmail);
router.route("/").post(insertCart);
router.route("/:productID/:email").delete(deleteCartByProductId);

export default router;
