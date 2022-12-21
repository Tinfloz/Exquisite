import axios from "axios";
import { IUserCreds } from "../../interfaces/user.creds";
import { IQty, IUser } from "../../interfaces/redux.interfaces/auth.slice.interface";
import { ICartResponse } from "../../interfaces/redux.interfaces/auth.slice.interface";

const API_URL = "http://localhost:5000/api/user"
const API_BUYER_URL = "http://localhost:5000/api/buyer"

// login user 
const loginUser = async (userDetails: IUserCreds): Promise<IUser> => {
    const response = await axios.post(API_URL + "/login", userDetails);
    if (response) {
        localStorage.setItem("user", JSON.stringify(response.data));
    };
    return response.data;
};

// register user
const registerUser = async (userDetails: IUserCreds): Promise<IUser> => {
    const response = await axios.post(API_URL + "/register", userDetails);
    if (response) {
        localStorage.setItem("user", JSON.stringify(response.data));
    };
    return response.data;
};

// add items to cart 
const addIndividualItemsToCart = async (id: string, token: string): Promise<ICartResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_BUYER_URL + `/add/item/${id}`, config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newLoginUser = {
        ...user.sendUser.loginUser,
        "cart": response.data.cart
    };
    const newSendUser = {
        ...user.sendUser,
        "loginUser": newLoginUser
    };
    const newUser = {
        ...user,
        sendUser: newSendUser
    }
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
};

// delete cart items
const deleteIndividualCartItems = async (id: string, token: string): Promise<ICartResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_BUYER_URL + `/delete/item/${id}`, config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newLoginUser = {
        ...user.sendUser.loginUser,
        "cart": response.data.cart
    };
    const newSendUser = {
        ...user.sendUser,
        "loginUser": newLoginUser
    };
    const newUser = {
        ...user,
        sendUser: newSendUser
    }
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
};

// clear cart
const clearAllItems = async (token: string): Promise<ICartResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.delete(API_BUYER_URL + `/clear/cart`, config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newLoginUser = {
        ...user.sendUser.loginUser,
        "cart": []
    };
    const newSendUser = {
        ...user.sendUser,
        "loginUser": newLoginUser
    };
    const newUser = {
        ...user,
        sendUser: newSendUser
    }
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
};

// update qty in cart
const updateProductQtyCart = async (cartId: (string | undefined), qty: IQty, token: string): Promise<ICartResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_BUYER_URL + `/update/cart/${cartId}`, qty, config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newLoginUser = {
        ...user.sendUser.loginUser,
        "cart": response.data.cart!
    };
    const newSendUser = {
        ...user.sendUser,
        "loginUser": newLoginUser
    };
    const newUser = {
        ...user,
        "sendUser": newSendUser
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
};


const authService = {
    loginUser,
    registerUser,
    addIndividualItemsToCart,
    deleteIndividualCartItems,
    clearAllItems,
    updateProductQtyCart
};

export default authService;