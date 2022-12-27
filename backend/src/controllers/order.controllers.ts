import Orders from "../models/order.model";
import mongoose from "mongoose";
import razorpay from "razorpay"
import shortid from "shortid";
import { Request, Response } from "express";
import { orderZodSchema } from "../zod.schemas/order.zod.schemas";
import crypto from "crypto";
import Buyers from "../models/buyer.model";

const createOrderWithRazorpay = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const order = await Orders.findById(id);
        let rzpInstance = new razorpay({
            key_id: process.env.API_KEY_ID,
            key_secret: process.env.API_KEY_SECRET,
        });
        const options = {
            amount: (order!.total) * 100,
            currency: "INR",
            receipt: shortid.generate()
        };
        let rzpOrder;
        try {
            rzpOrder = await rzpInstance.orders.create(options);
        } catch (error) {
            console.log(error);
        };
        if (!rzpOrder) {
            res.status(500).json({
                success: false
            })
            return;
        };
        res.status(200).json({
            success: true,
            rzpOrder
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

const updateOrderToPaid = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const result = orderZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const buyer = await Buyers.findOne({
            userId: req.user!._id
        });
        const order = await Orders.findById(id);
        if (!order) {
            throw "order not found"
        };
        const { orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature, } = result.data;
        let shasum = crypto.createHmac("sha256", process.env.API_KEY_SECRET!);
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`)
        let digest = shasum.digest("hex");
        if (digest !== razorpaySignature) {
            throw "payment not legit"
        };
        order.isPaid = true;
        order.isPaidAt = new Date();
        order.rzpOrderId = razorpayOrderId;
        await order.save();
        buyer?.orders!.push(order._id);
        await buyer?.save();
        res.status(200).json({
            success: true
        });
    } catch (error: any) {
        if (error === "order not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            })
        } else if (error === "payment not legit") {
            res.status(400).json({
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

// get all buyer orders 
const getBuyerOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const buyer = await Buyers.findOne({
            userId: req.user!._id
        }).populate({
            path: "orders",
            populate: {
                path: "items.product"
            }
        });
        console.log(buyer, "buyer")
        res.status(200).json({
            success: true,
            result: buyer!.orders
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    }
}

export {
    createOrderWithRazorpay,
    updateOrderToPaid,
    getBuyerOrders
};