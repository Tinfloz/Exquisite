import Users from "../models/all.user.model";
import Sellers from "../models/seller.model";
import Buyers from "../models/buyer.model";
import { Request, Response } from "express";
import { userZodSchema, addressZodSchema } from "../zod.schemas/user.zod.schema";
import { getToken } from "../utils/get.access.token";
import { getLatLong } from "../helpers/get.lat.long";

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
        if (user && await user?.matchPassword(password)) {
            const loginUser = user.userType === "Buyer" ? await Buyers.findOne({ userId: user._id }).
                select("cart address city province pincode") :
                await Sellers.findOne({ userid: user._id }).select("address city province pincode");
            const sendUser = {
                email,
                userType: user.userType,
                name: user.name,
                token: getToken(user._id),
                loginUser
            };
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
        const { address, city, province, pincode, userType } = result.data;
        const userAddress = `${address}, ${city}`
        const [latitude, longitude] = await getLatLong(userAddress)
        const loggedInUser = userType === "Buyer" ? await Buyers.findOneAndUpdate({
            userId: req.user!._id
        }, { address, city, province, pincode, latitude, longitude }, { new: true }) :
            await Sellers.findOneAndUpdate({
                userId: req.user!._id
            }, { address, city, province, pincode, latitude, longitude }, { new: true })
        const sendAddress = {
            address,
            city,
            province,
            pincode
        };
        res.status(200).json({ sendAddress });
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

export {
    register,
    login,
    setUserAddress
}