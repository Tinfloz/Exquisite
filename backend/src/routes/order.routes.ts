import express from "express";
import { createOrderWithRazorpay, getBuyerOrders, updateOrderToPaid } from "../controllers/order.controllers";
import { userProtect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/checkout/order/:id").get(userProtect, createOrderWithRazorpay);
router.route("/verify/payment/:id").post(userProtect, updateOrderToPaid);
router.route("/get/user/orders").get(userProtect, getBuyerOrders);

export default router;