import mongoose from "mongoose";
import { UserDocument } from "./all.user.model.js";

export interface Seller extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId | UserDocument;
    products?: (mongoose.Schema.Types.ObjectId | {})[];
    address?: string;
    city?: string;
    province?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number
}

export interface SellerModel extends mongoose.Model<Seller> {
    instanceOfSeller: (param: any) => param is Seller
}

const sellerSchema = new mongoose.Schema<Seller, SellerModel>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
    products: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Products"
        }
    ],
    address: {
        type: String
    },
    city: {
        type: String
    },
    province: {
        type: String
    },
    pincode: {
        type: String
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }
}, { timestamps: true });

sellerSchema.statics.instanceOfSeller = (param: any): param is Seller => {
    return param.userId !== undefined
}

const Sellers = mongoose.model<Seller, SellerModel>("Sellers", sellerSchema);

export default Sellers;