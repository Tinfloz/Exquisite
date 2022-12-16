import express from "express";
import { getAllProducts, getProductsById, getTopProductsByRatings, getTopProductsBySales } from "../controllers/product.controller";
import { userProtect, admin } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/get/products").get(userProtect, getAllProducts);
router.route("/get/products/:id").get(userProtect, getProductsById);
router.route("/get/top/sales").get(userProtect, admin, getTopProductsBySales);
router.route("/get/top/ratings").get(userProtect, admin, getTopProductsByRatings);

export default router;