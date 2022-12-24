import express from "express";
import { getAllProducts, getProductsById } from "../controllers/product.controller";
import { userProtect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/get/products").get(userProtect, getAllProducts);
router.route("/get/products/:id").get(userProtect, getProductsById);

export default router;