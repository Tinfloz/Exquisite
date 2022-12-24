import { Request, Response } from "express";
import mongoose from "mongoose";
import Products from "../models/product.model";
import Sellers from "../models/seller.model";
import _ from "lodash";
import Orders from "../models/order.model";
import { Product } from "../models/product.model";
import { ratingZodSchema } from "../zod.schemas/product.zod.schema";

// get all products
const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Products.find();
        res.status(200).json({
            success: true,
            products
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// get products by id
const getProductsById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const product = await Products.findById(id).populate("comments.user");
        res.status(200).json({
            success: true,
            product
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};


// rate products 
const rateProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const result = ratingZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const product = await Products.findById(id);
        if (!product) {
            throw "product not found";
        };
        product!.ratings!.push(result.data.rating);
        await product.save();
    } catch (error: any) {
        if (error === "product not found") {
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

export {
    getAllProducts,
    getProductsById,
    // getTopProductsBySales,
    // getTopProductsByRatings,
    rateProducts
};