import Users from "../models/all.user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const userProtect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
            req.user = await Users.findById(decoded.id)!;
            if (!req.user) {
                throw "no user found";
            }
            next();
        } else {
            throw "token not found";
        };
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.errors?.[0]?.message || error
        });
    };
};

const admin = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (req.user?.userType === "Seller") {
            next();
        } else {
            throw "not authorized"
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.errors?.[0]?.message || error
        });
    };
};

export {
    userProtect, admin
}