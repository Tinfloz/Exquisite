import express from "express";
import { createProduct, deleteProduct, getAllOrders, markDelivered, updateStock } from "../controllers/seller.controller";
import { admin, userProtect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/create/product").post(userProtect, admin, createProduct);
router.route("/update/stock/:id").post(userProtect, admin, updateStock);
router.route("/delete/product/:id").get(userProtect, admin, deleteProduct);
router.route("/get/my/orders").get(userProtect, admin, getAllOrders);
router.route("/mark/delivered").get(userProtect, admin, markDelivered);

export default router;
