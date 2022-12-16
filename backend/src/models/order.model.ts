import mongoose from "mongoose";
import { Product } from "./product.model.js";
import { Seller } from "./seller.model.js";
import { Buyer } from "./buyer.model.js";

interface item {
    product: mongoose.Schema.Types.ObjectId | Product;
    delivered: boolean;
    qty: number;
    seller: mongoose.Schema.Types.ObjectId | Seller
}

export interface Order extends mongoose.Document {
    items: Array<item>;
    buyer: mongoose.Schema.Types.ObjectId;
    shippingFee: number;
    salesTax: number;
    total: number;
    isPaid: boolean;
    isPaidAt?: Date;
}

const orderSchema = new mongoose.Schema<Order>({
    items: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Products"
            },
            delivered: {
                type: Boolean,
                default: false
            },
            qty: {
                type: Number
            },
            seller: {
                type: mongoose.Types.ObjectId,
                ref: "Sellers"
            }
        }
    ],
    shippingFee: {
        type: Number,
        required: true
    },
    salesTax: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    buyer: {
        type: mongoose.Types.ObjectId,
        ref: "Buyers"
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    isPaidAt: {
        type: Date
    }
});

const Orders = mongoose.model<Order>("Orders", orderSchema);

export default Orders;
