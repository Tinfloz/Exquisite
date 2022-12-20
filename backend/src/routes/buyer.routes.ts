import express from "express";
import { addItemsToCart, cartToOrder, clearCart, commentOnProducts, deleteCartItems, deleteComments, editComments, itemToOrder, updateCart } from "../controllers/buyer.controller";
import { userProtect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/add/item/:productId").get(userProtect, addItemsToCart);
router.route("/update/cart/:id").post(userProtect, updateCart);
router.route("/order/cart").get(userProtect, cartToOrder);
router.route("/order/item/:id").post(userProtect, itemToOrder);
router.route("/comment/:productId").post(userProtect, commentOnProducts);
router.route("/edit/:productId/:commentId").post(userProtect, editComments);
router.route("/delete/:productId/:commentId").delete(userProtect, deleteComments);
router.route("/clear/cart").delete(userProtect, clearCart);
router.route("/delete/item/:cartId").get(userProtect, deleteCartItems);

export default router;