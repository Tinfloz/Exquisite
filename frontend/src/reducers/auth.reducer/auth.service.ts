import axios from "axios";
import { IUserCreds } from "../../interfaces/user.creds";
import { IQty, ISetAddressParam, ISetAddressResponse, IUser } from "../../interfaces/redux.interfaces/auth.slice.interface";
import { ICartResponse } from "../../interfaces/redux.interfaces/auth.slice.interface";
import { IProduct } from "../../interfaces/redux.interfaces/product.interfaces";
import { ISellerCreateProductParam, ISellerResponse } from "../../interfaces/redux.interfaces/seller.slice.interface";

const API_URL = "http://localhost:5000/api/user"
const API_BUYER_URL = "http://localhost:5000/api/buyer"
const API_SELLER_URL = "http://localhost:5000/api/seller"
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

// create new products seller
const createNewProductsSeller = async (productDetails: ISellerCreateProductParam, token: string): Promise<ISellerResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_SELLER_URL + "/create/product", productDetails, config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newLoginUser = {
        ...user.sendUser.loginUser,
        "products": [...user.sendUser.loginUser.products, response.data.product]
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

// delete products
const deleteSellerProducts = async (id: string, token: string): Promise<ISellerResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    console.log(id, "id in service")
    const response = await axios.get(API_SELLER_URL + `/delete/product/${id}`, config);
    console.log(response.data, "in service")
    const user = JSON.parse(localStorage.getItem("user")!);
    const newProductsArray = user.sendUser.loginUser.products.filter((element: IProduct) => element._id !== response.data.producId);
    const newLoginUser = {
        ...user.sendUser.loginUser,
        "products": newProductsArray,
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

const setLoginUserAddress = async (token: string, addressDetails: ISetAddressParam): Promise<ISetAddressResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + "/set/address", addressDetails, config);
    const { address, city, province, pincode } = response.data.sendAddress;
    const user = JSON.parse(localStorage.getItem("user")!);
    const newLoginUser = {
        ...user.sendUser.loginUser,
        address, city, province, pincode
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

// change account details 
const changeUserDetails = async (token: string, changeDetails: { email?: string, password?: string }): Promise<{ success: boolean, email: string }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + "/change/details", changeDetails, config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newSendUser = { ...user.sendUser, email: response.data.email };
    const newUser = { ...user, "sendUser": newSendUser };
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
};

// get reset link 
const getResetLinkUser = async (email: { email: string }): Promise<{ success: boolean }> => {
    const response = await axios.post(API_URL + "/reset/password/link", email);
    return response.data;
};

// reset password set
const setPasswordReset = async (passwordDetails: { password: string, confirmPassword: string }, token: string): Promise<{ success: boolean }> => {
    const response = await axios.post(API_URL + `/reset/password/set/${token}`, passwordDetails);
    return response.data;
};

const authService = {
    loginUser,
    registerUser,
    addIndividualItemsToCart,
    deleteIndividualCartItems,
    clearAllItems,
    updateProductQtyCart,
    createNewProductsSeller,
    deleteSellerProducts,
    setLoginUserAddress,
    changeUserDetails,
    getResetLinkUser,
    setPasswordReset
};

export default authService;