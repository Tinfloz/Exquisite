import express from "express";
import { createProduct, deleteProduct, getAllOrders, getOrderAndProduct, markDelivered, updateStock } from "../controllers/seller.controller";
import { admin, userProtect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/create/product").post(userProtect, admin, createProduct);
router.route("/update/stock/:id").post(userProtect, admin, updateStock);
router.route("/delete/product/:id").get(userProtect, admin, deleteProduct);
router.route("/get/my/orders").get(userProtect, admin, getAllOrders);
router.route("/mark/delivered/:orderId/:productId").get(userProtect, admin, markDelivered);
router.route("/get/order/product/:orderId/:productId").get(userProtect, admin, getOrderAndProduct);

export default router;
