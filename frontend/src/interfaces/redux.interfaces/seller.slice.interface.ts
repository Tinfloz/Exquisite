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