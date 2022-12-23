import { IProduct } from "./product.interfaces";
import { ValidationErrors } from "./redux.errors";

export interface ISellerResponse {
    success: boolean,
    product?: IProduct,
    producId?: string
};

export interface ISellerCreateProductParam {
    item: string,
    image: string,
    description: string,
    price: string,
    stock: string,
};

export interface ISellerInit {
    productStack: IProduct | null,
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
    message: ValidationErrors | string
};

export interface ISingleMyOrder {
    orderId: string,
    qty: number,
    item: string,
    productId: string,
    address: string,
    city: string,
    province: string,
    pincode: string
};

export interface IMyOrdersResponse {
    success: boolean,
    ordersArray: Array<ISingleMyOrder>
};

export interface ISellerSliceOrdersInit {
    orderStack: Array<ISingleMyOrder> | null,
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
    message: string | ValidationErrors
}