import express from "express";
import { login, register, setUserAddress } from "../controllers/user.controller";
import { userProtect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/set/address").post(userProtect, setUserAddress);

export default router;