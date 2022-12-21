import { ICartElement } from "./auth.slice.interface";
import { ValidationErrors } from "./redux.errors";

export interface IProduct {
    _id: string,
    item: string,
    description: string,
    image: string,
    price: number,
    seller: string,
    stock: number,
    comments: Array<unknown>,
    sale?: number,
    ratings: Array<number>,
    total?: number
};

export interface IProductResponse {
    success: boolean,
    products?: Array<IProduct>
    product?: IProduct
    cart?: ICartElement
}

export interface IProductInitialState {
    product: Array<IProduct> | IProduct | null | ICartElement,
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
    message: string | ValidationErrors
}