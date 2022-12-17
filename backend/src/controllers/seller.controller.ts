import Sellers from "../models/seller.model";
import Products from "../models/product.model";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { productZodSchema, stockZodSchema } from "../zod.schemas/seller.zod.schema"
import Orders from "../models/order.model";
import Buyers from "../models/buyer.model";
import { multiIdValidator } from "../helpers/multi.id.validator";
import { sendEmail } from "../utils/send.email";
import Users from "../models/all.user.model";


// create a new product
const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = productZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            })
            return;
        };
        const { item, description, price, stock, image } = result.data;
        const seller = await Sellers.findOne({
            userId: req.user!._id
        });
        const product = await Products.create({
            item, image, description, price, stock, seller: seller!._id
        });
        if (!product) {
            throw "product could not be created"
        }
        seller!.products!.push(
            product._id
        );
        await seller!.save();
        res.status(200).json({
            success: true,
            product
        });
    } catch (error: any) {
        if (error === "product could not be created") {
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

// update stock
const updateStock = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const product = await Products.findById(id);
        if (!product) {
            throw "product not found";
        };
        const result = stockZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const seller = await Sellers.findOne({
            userId: req.user!._id
        })
        if (product.seller.toString() !== seller!._id.toString()) {
            throw "not authorized"
        }
        product.stock = result.data.stock;
        await product.save();
        res.status(200).json({
            success: true,
            stock: result.data.stock
        });
    } catch (error: any) {
        if (error === "product not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "not authorized") {
            res.status(403).json({
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

// delete products
const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const seller = await Sellers.findOne({
            userId: req.user!._id
        });
        const product = await Products.findById(id);
        if (!product) {
            throw "product not found"
        };
        for (let i of seller!.products!) {
            if (i.toString() === product!._id!.toString()) {
                let index = seller!.products!.indexOf(i);
                seller!.products!.splice(index, 1);
                await seller?.save();
                break;
            };
        };
        await product!.remove();
        res.status(200).json({
            success: true,
            producId: id
        })
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

// get all orders
const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const seller = await Sellers.findOne({
            userId: req.user!._id
        });
        interface IOrderItem {
            address: string,
            city: string,
            province: string,
            pincode: string,
            orderId: mongoose.Schema.Types.ObjectId,
            product: string,
            productId: mongoose.Schema.Types.ObjectId,
            qty: number
        };
        let ordersArray: Array<IOrderItem> = [];
        for await (let order of Orders.find().populate("buyer")) {
            if (order.isPaid) {
                console.log(order)
                for (let element of order.items) {
                    if (!element.delivered && (element.seller.toString() === seller!._id.toString())) {
                        let orderItem = {} as IOrderItem;
                        if (Buyers.instanceOfBuyer(order!.buyer!)) {
                            Object.assign(orderItem, {
                                address: order!.buyer!.address,
                                city: order!.buyer!.city,
                                province: order!.buyer!.province,
                                pincode: order!.buyer!.province,
                            })
                        } else {
                            throw "interface error"
                        };
                        orderItem = {
                            ...orderItem, orderId: order!._id,
                            productId: !Products.instanceOfProduct(element.product) ? element.product : element.product._id,
                            qty: element.qty
                        };
                        ordersArray.push(orderItem);
                    };
                };
            };
        };
        res.status(200).json({
            success: true,
            ordersArray
        })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// mark delivered
const markDelivered = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId, productId } = req.params;
        if (multiIdValidator([orderId, productId])) {
            throw "ids invalid"
        };
        const order = await Orders.findById(orderId);
        const seller = await Sellers.findOne({
            userId: req.user!._id
        }).populate("userId");
        const product = await Products.findById(productId);
        for (let element of order!.items) {
            if (element!.product.toString() === productId) {
                element.delivered = true;
                product!.stock = product!.stock - 1;
                await product!.save()
                await order!.save();
                break;
            };
        };
        if (product!.stock <= 10) {
            try {
                await sendEmail({
                    email: Users.instanceOfUser(seller!.userId) ? seller!.userId!.email : undefined,
                    subject: `Restock product ${product!._id}`,
                    emailToSend: `Stock of product: ${product!._id} less than 10`
                })
            } catch (error) {
                console.log(error)
            };
        };
        res.status(200).json({
            success: true,
            productId,
            orderId
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};


export {
    createProduct,
    updateStock,
    deleteProduct,
    getAllOrders,
    markDelivered
};