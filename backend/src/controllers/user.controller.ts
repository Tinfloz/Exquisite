import Users from "../models/all.user.model";
import Sellers from "../models/seller.model";
import Buyers from "../models/buyer.model";
import { Request, Response } from "express";
import { userZodSchema, addressZodSchema, resetPasswordLinkZodSchema, resetPasswordSetZodSchema } from "../zod.schemas/user.zod.schema";
import { getToken } from "../utils/get.access.token";
import { getLatLong } from "../helpers/get.lat.long";
import { userAccChangeZodSchema } from "../zod.schemas/user.zod.schema";
import { sendEmail } from "../utils/send.email";
import crypto from "crypto";

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = userZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const { email, password, userType, name } = result.data;
        const userExists = await Users.findOne({
            email: email
        });
        if (userExists) {
            throw "user already exists"
        };
        const user = await Users.create({
            email,
            password,
            userType,
            name
        });
        const loginUser = userType === "Buyer" ?
            await Buyers.create({
                userId: user._id
            })
            : await Sellers.create({
                userId: user._id
            })
        const sendUser = {
            email,
            name,
            userType,
            token: getToken(user._id),
            loginUser
        };
        res.status(200).json({ sendUser });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = userZodSchema.safeParse(req.body);
        console.log(result, "result")
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const { email, password } = result.data;
        const user = await Users.findOne({
            email
        });
        console.log(user!._id, "user")
        if (user && await user?.matchPassword(password)) {
            const loginUser = user.userType === "Buyer" ? await Buyers.findOne({ userId: user._id }).
                select("cart address city province pincode").populate("cart.product") :
                await Sellers.findOne({ userId: user._id }).select("address city province pincode products").populate("products");
            const sendUser = {
                email,
                userType: user.userType,
                name: user.name,
                token: getToken(user._id),
                loginUser
            };
            console.log("loginUser", loginUser)
            res.status(200).json({
                sendUser
            })
        } else {
            if (!user?.matchPassword(password)) {
                throw "passwords don't match"
            };
            throw "user not found"
        }
    } catch (error: any) {
        if (error === "passwords don't match") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "user not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

const setUserAddress = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = addressZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const { address, city, pincode, province } = result.data;
        const user = await Users.findById(req.user!._id);
        const addressUser = `${address}, ${city}`
        const [latitude, longitude] = await getLatLong(addressUser)
        user?.userType === "Buyer" ? await Buyers.findOneAndUpdate({
            userId: req.user!._id
        }, { address, city, pincode, province, latitude, longitude }, { new: true }) :
            await Sellers.findOneAndUpdate({
                userId: req.user!._id
            }, { address, city, pincode, province, latitude, longitude }, { new: true })
        const sendAddress = {
            address, city, pincode, province,
        }
        res.status(200).json({
            sendAddress
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

const changeAccountDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = userAccChangeZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return
        };
        const user = await Users.findById(req.user!._id);
        const { email, password } = result.data;
        user!.email = email || user!.email;
        user!.password = password || user!.password;
        await user!.save();
        res.status(200).json({
            success: true,
            email: user!.email
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// reset password link generate
const getResetPasswordLink = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = resetPasswordLinkZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const user = await Users.findOne({
            email: result.data.email
        });
        if (!user) {
            throw "user not found"
        };
        const resetToken = user.getResetToken();
        await user.save();
        const resetUrl = `${req.get("origin")}/reset/password/${resetToken}`;
        const emailToSend = `Click on this link: ${resetUrl} to reset your password!`
        const subject = "Reset password"
        try {
            await sendEmail({
                email: result.data.email,
                subject,
                emailToSend
            })
        } catch (error: any) {
            console.log(error);
            user.resetToken = undefined;
            user.resetTokenExpires = undefined;
            await user.save();
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
            return;
        };
        res.status(200).json({
            sucsess: true
        })
    } catch (error: any) {
        if (error === "user not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// reset password
const resetPasswordSet = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const result = resetPasswordSetZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const resetToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await Users.findOne({
            resetToken,
            resetTokenExpires: {
                $gt: Date.now()
            }
        });
        if (!user) {
            throw "token has expired"
        };
        const { password, confirmPassword } = result.data;
        if (password !== confirmPassword) {
            throw "passwords don't match"
        };
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();
        res.status(200).json({
            success: true
        });
    } catch (error: any) {
        if (error === "token has expired" || "passwords don't match") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};


export {
    register,
    login,
    setUserAddress,
    changeAccountDetails,
    getResetPasswordLink,
    resetPasswordSet
}