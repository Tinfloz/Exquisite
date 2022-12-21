import { IProduct } from "./product.interfaces"
import { ValidationErrors } from "./redux.errors"

export interface ISendUser {
    email: string,
    userType: string,
    token: string,
    [x: string]: any;
}

export interface IUser {
    sendUser: ISendUser | null
}

export interface IAuthInit {
    user: ISendUser | null,
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
    message: string | ValidationErrors
}

export interface ICartElement {
    product: IProduct,
    qty: number
    _id: string
};

export interface ICartResponse {
    success: boolean
    cart?: Array<ICartElement>
    message?: string
};

export interface IQty {
    qty: number
};

export interface IUpdateCartParam {
    cartId: string | undefined,
    quantity: {
        qty: number
    }
};