import express from "express";
import { changeAccountDetails, login, register, setUserAddress } from "../controllers/user.controller";
import { userProtect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/set/address").post(userProtect, setUserAddress);
router.route("/change/details").post(userProtect, changeAccountDetails);

export default router;