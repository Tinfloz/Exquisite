import mongoose from "mongoose";
import { UserDocument } from "./all.user.model";
import { Product } from "./product.model"
import { Order } from "./order.model";

interface cart {
    product: mongoose.Schema.Types.ObjectId | Product,
    qty?: number,
    _id?: mongoose.Schema.Types.ObjectId
};

export interface Buyer extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId;
    address?: string;
    city?: string;
    province?: string;
    pincode?: string;
    cart?: Array<cart>;
    orders?: (mongoose.Schema.Types.ObjectId | Order)[];
    latitude?: number;
    longitude?: number;
};

interface BuyerModel extends mongoose.Model<Buyer> {
    instanceOfBuyer: (param: any) => param is Buyer
}

const buyerSchema = new mongoose.Schema<Buyer, BuyerModel>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Users"
    },
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
    },
    cart: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Products"
            },
            qty: {
                type: Number,
                default: 1
            }
        }
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Orders"
        }
    ]
}, { timestamps: true });

buyerSchema.statics.instanceOfBuyer = (param: any): param is Buyer => {
    return param.userId !== undefined
}

const Buyers = mongoose.model<Buyer, BuyerModel>("Buyers", buyerSchema);

export default Buyers;