import Buyers from "../models/buyer.model";
import Products from "../models/product.model";
import Users from "../models/all.user.model";
import mongoose from "mongoose";
import { Response, Request } from "express";
import { Product } from "../models/product.model";
import { commentZodSchema, qtyZodSchema } from "../zod.schemas/buyer.zod.schemas";
import { getDistance } from "../helpers/get.distance";
import Sellers from "../models/seller.model";
import { getTaxes } from "../helpers/get.tax";
import Orders from "../models/order.model";
import data from "../helpers/constants.json";
import { multiIdValidator } from "../helpers/multi.id.validator";


// add items to cart
const addItemsToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;
        const product = await Products.findById(productId);
        console.log(product, "product")
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw "id not valid"
        };
        const buyer = await Buyers.findOne({
            userId: req.user!._id
        }).populate("cart.product");
        for (let element of buyer!.cart!) {
            if (Products.instanceOfProduct(element!.product!)) {
                if (element.product._id.toString() === productId) {
                    throw "already in cart";
                };
            };
        };
        buyer!.cart!.push({
            product: product!
        });
        await buyer?.save();
        res.status(200).json({
            success: true,
            cart: buyer!.cart
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// update cart 
const updateCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const result = qtyZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const buyer = await Buyers.findOne({
            userId: req.user!._id
        }).populate("cart.product");
        buyer!.cart!.forEach(async element => {
            if (element!._id!.toString() === id) {
                element.qty = result.data.qty;
                await buyer?.save()
            };
        });
        res.status(200).json({
            success: true,
            cart: buyer!.cart
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// order cart items 
const cartToOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const buyer = await Buyers.findOne({
            userId: req.user!._id
        }).populate({
            path: "cart.product",
            populate: {
                path: "seller",
                select: "latitude longitude userId"
            }
        });
        let shippingFee = 0;
        let salesTax = 0;
        let totalArray = [];
        let itemArray = [];
        for (let element of buyer!.cart!) {
            let seller;
            let latLong: Array<number> = [];
            let taxProd = 0;
            let itemTotal = 0;
            if (Products.instanceOfProduct(element!.product!)) {
                console.log("prod int", Products.instanceOfProduct(element!.product!))
                seller = element!.product!.seller!;
                taxProd = Number(getTaxes(element!.product!.price!) * element!.qty!);
                salesTax += taxProd;
                itemTotal = Number(element!.product!.price! * element!.qty!)
                if (Sellers.instanceOfSeller(element!.product!.seller!)) {
                    latLong.push(element!.product!.seller!.latitude!, element!.product!.seller!.longitude!)
                } else {
                    throw "interface error"
                }
            } else {
                throw "interface error"
            }
            const item = {
                product: element!.product,
                qty: element!.qty,
                seller
            };
            itemArray.push(item);
            const distance = getDistance(buyer!.latitude!, buyer!.longitude!,
                latLong[0], latLong[1]);
            const shippingFeeProd = Number(distance * data.shippingFeePerKilometer);
            shippingFee += shippingFeeProd;
            const itemSubTotal = Number(itemTotal + taxProd + shippingFeeProd)
            totalArray.push(itemSubTotal);
        };
        const total = totalArray.reduce((pv, cv) => pv + cv);
        const order = await Orders.create({
            items: itemArray,
            shippingFee,
            salesTax,
            total: Number(total),
            buyer: buyer!._id
        }).then(async (order) => {
            let result = await Orders.findById(order._id).lean().populate({
                path: "items.product",
                options: {
                    lean: true
                }
            })
            res.status(200).json({
                success: true,
                result
            });
        });
    } catch (error: any) {
        console.log(error, "error")
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// order single item 
const itemToOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "id not valid"
        };
        const result = qtyZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const buyer = await Buyers.findOne({
            userId: req.user!._id
        })
        const { qty } = result.data;
        const product = await Products.findById(id)
            .populate({
                path: "seller",
                select: "userId latitude longitude"
            });
        if (!product) {
            throw "product not found"
        }
        const itemsArray = [
            {
                product: product!._id,
                qty,
                seller: product!.seller
            }
        ];
        let latLong = [];
        if (Sellers.instanceOfSeller(product!.seller!)) {
            latLong.push(product!.seller!.latitude, product!.seller!.longitude);
        } else {
            throw "interface error"
        }
        const distance = getDistance(buyer?.latitude!, buyer?.longitude!, latLong[0]!, latLong[1]!);
        const shippingFee = distance * data.shippingFeePerKilometer;
        const salesTax = getTaxes(product!.price!) * qty;
        const itemTotal = product!.price! * qty;
        const total = itemTotal + shippingFee + salesTax;
        const order = await Orders.create({
            items: itemsArray,
            shippingFee,
            salesTax,
            total,
            buyer: buyer!._id
        }).then(async (order) => {
            let result = await Orders.findById(order._id).lean().populate({
                path: "items.product",
                options: {
                    lean: true
                }
            });
            res.status(200).json({
                success: true,
                result
            })
        })
    } catch (error: any) {
        if (error === "product not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// comment on products
const commentOnProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw "id not valid";
        };
        const result = commentZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const { comment } = result.data;
        const buyer = await Buyers.findOne({ userId: req.user!._id })
        const product = await Products.findById(productId);
        if (!product) {
            throw "product not found"
        };
        const commentAdd = {
            user: buyer!._id,
            comment
        }
        product.comments?.push(commentAdd);
        await product.save();
        res.status(200).json({
            success: true,
            commentAdd
        });
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

// delete comment
const deleteComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const { commentId, productId } = req.params;
        if (multiIdValidator([commentId, productId])) {
            throw "id invalid"
        };
        const product = await Products.findById(productId);
        if (!product) {
            throw "product not found"
        };
        const buyer = await Buyers.findOne({
            userId: req.user!._id
        });
        for (let element of product!.comments!) {
            if (element!._id!.toString() === commentId) {
                if (element!.user.toString() !== buyer!._id.toString()) {
                    throw "not authorised"
                };
                const index = product!.comments!.indexOf(element);
                product!.comments!.splice(index, 1);
                await product!.save();
                break;
            };
        };
        res.status(200).json({
            success: true,
            commentId,
            productId
        });
    } catch (error: any) {
        if (error === "product not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "not authorised") {
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

// edit comments
const editComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const buyer = await Buyers.findOne({
            userId: req.user!._id
        });
        const { commentId, productId } = req.params;
        if (multiIdValidator([commentId, productId])) {
            throw "id not valid"
        };
        const result = commentZodSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                success: false,
                error: result.error
            });
            return;
        };
        const product = await Products.findById(productId);
        if (!product) {
            throw "product not found"
        };
        for (let element of product!.comments!) {
            if (element!._id!.toString() === commentId) {
                if (element!.user.toString() !== buyer?._id.toString()) {
                    throw "not authorized"
                };
                element!.comment = result.data.comment;
                await product!.save();
                break;
            };
        };
        res.status(200).json({
            success: true,
            newComment: result.data.comment,
            commentId,
            productId
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

// clear cart
const clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const buyer = await Buyers.findOne({
            userId: req.user!._id
        });
        while (buyer!.cart!.length !== 0) {
            buyer!.cart!.pop();
        };
        await buyer!.save();
        res.status(200).json({
            success: true,
            message: "cart cleared"
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// delete cart items
const deleteCartItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cartId } = req.params;
        console.log(cartId, "cartIddd")
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            throw "id not valid";
        };
        const buyer = await Buyers.findOne({
            userId: req.user!._id
        }).populate("cart.product");
        console.log(buyer, "buyerrr")
        for (let element of buyer!.cart!) {
            if (element!._id!.toString() === cartId) {
                const index = buyer!.cart!.indexOf(element);
                buyer!.cart!.splice(index, 1);
                await buyer!.save();
                break;
            };
        };
        res.status(200).json({
            success: true,
            cart: buyer!.cart!
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// get all cart items 
const getAllCartItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const buyer = await Buyers.findOne({
            userId: req.user!._id
        }).populate("cart.product");
        res.status(200).json({
            success: true,
            cart: buyer!.cart!
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

export {
    addItemsToCart,
    updateCart,
    cartToOrder,
    itemToOrder,
    commentOnProducts,
    deleteComments,
    editComments,
    clearCart,
    deleteCartItems,
    getAllCartItems
}