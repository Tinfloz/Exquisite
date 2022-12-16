import { Request, Response } from "express";
import mongoose from "mongoose";
import Products from "../models/product.model";
import Sellers from "../models/seller.model";
import _ from "lodash";
import Orders from "../models/order.model";
import { Product } from "../models/product.model";
import { ratinZodSchema } from "../zod.schemas/product.zod.schema";

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
        const product = await Products.findById(id);
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


// get top products by sales
const getTopProductsBySales = async (req: Request, res: Response): Promise<void> => {
    try {
        const seller = await Sellers.findOne({
            userId: req.user!._id
        }).populate("products").lean();
        let prodArray = [];
        for (let indProd of seller!.products!) {
            let newIndProd = Object.assign(indProd, { sale: 0 });
            prodArray.push(newIndProd)
        };
        for (let element of prodArray) {
            console.log(element, "first")
            for await (let order of Orders.find()) {
                if (order.isPaid) {
                    for (let i of order.items) {
                        if (Products.instanceOfProduct(element)) {
                            if (element._id.toString() === i.product.toString()) {
                                element.sale += i.qty;
                            };
                        };
                    };
                };
            };
        };
        res.status(200).json({
            success: true,
            prodArray
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// get top products by ratings
const getTopProductsByRatings = async (req: Request, res: Response): Promise<void> => {
    try {
        const seller = await Sellers.findOne({
            userId: req.user!._id
        }).populate("products").lean();
        const prodArray = [];
        for (let element of seller!.products!) {
            if (Products.instanceOfProduct(element)) {
                let total = element!.ratings!.reduce((pv, cv) => pv + cv);
                Object.assign(element, total);
                prodArray.push(element);
            };
        };
        res.status(200).json({
            success: true,
            products: _.orderBy(prodArray, "total", "desc")
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
        const result = ratinZodSchema.safeParse(req.body);
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
    getTopProductsBySales,
    getTopProductsByRatings,
    rateProducts
};