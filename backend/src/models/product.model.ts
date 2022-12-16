import mongoose from "mongoose";
import { Seller } from "./seller.model.js"
import { Buyer } from "./buyer.model.js"
import { UserDocument } from "./all.user.model.js";


interface comment {
    user: mongoose.Schema.Types.ObjectId | UserDocument,
    comment: string,
    _id?: mongoose.Schema.Types.ObjectId
};

export interface Product extends mongoose.Document {
    item: string;
    image: string;
    description?: string;
    price: number;
    stock: number;
    ratings?: Array<number>;
    seller: mongoose.Schema.Types.ObjectId | Seller;
    comments?: Array<comment>
};

export interface ProductModel extends mongoose.Model<Product> {
    instanceOfProduct: (param: any) => param is Product
}

const productSchema = new mongoose.Schema<Product, ProductModel>({
    item: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    ratings: [
        {
            type: Number
        }
    ],
    seller: {
        type: mongoose.Types.ObjectId,
        ref: "Sellers"
    },
    stock: {
        type: Number,
        required: true
    },
    comments: [
        {
            user: {
                type: mongoose.Types.ObjectId,
                ref: "Users"
            },
            comment: {
                type: String
            }
        }
    ]
}, { timestamps: true });

productSchema.statics.instanceOfProduct = (param: any): param is Product => {
    return param.item !== undefined;
};

const Products = mongoose.model<Product, ProductModel>("Products", productSchema);

export default Products;