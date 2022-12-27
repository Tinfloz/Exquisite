import { IProduct } from "./product.interfaces";
import { ValidationErrors } from "./redux.errors";

export interface IItems {
    product: IProduct,
    delivered: boolean,
    qty: number,
    seller: string
};

export interface IOrder {
    _id: string
    items: Array<IItems>
    buyer: string,
    shippingFee: number;
    salesTax: number;
    total: number;
    isPaid: boolean;
    isPaidAt?: Date;
};

export interface IOrderResponse {
    success: boolean
    result: IOrder
};

export interface IOrderInit {
    order: IOrder | null,
    razorpayResponse: any
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
    message: ValidationErrors | string
};

export interface IOrderSingleItemParam {
    id: string,
    quantity: {
        qty: number
    }
};