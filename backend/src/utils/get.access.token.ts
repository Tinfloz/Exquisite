import jwt from "jsonwebtoken";
import mongoose from "mongoose"

export const getToken = (id: mongoose.Types.ObjectId): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: "5d"
    });
};