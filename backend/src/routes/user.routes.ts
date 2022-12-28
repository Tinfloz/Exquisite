import express from "express";
import { changeAccountDetails, getResetPasswordLink, login, register, resetPasswordSet, setUserAddress } from "../controllers/user.controller";
import { userProtect } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/set/address").post(userProtect, setUserAddress);
router.route("/change/details").post(userProtect, changeAccountDetails);
router.route("/reset/password/link").post(getResetPasswordLink);
router.route("/reset/password/set/:token").post(resetPasswordSet);

export default router;