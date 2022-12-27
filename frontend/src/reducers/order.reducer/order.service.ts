import axios from "axios";
import { IQty } from "../../interfaces/redux.interfaces/auth.slice.interface";
import { IOrderResponse } from "../../interfaces/redux.interfaces/order.slice.interface";


const API_URL = "http://localhost:5000/api/buyer";
const API_ORDER_URL = "http://localhost:5000/api/order";

const cartItemsCreateOrder = async (token: string): Promise<IOrderResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/order/cart", config);
    return response.data;
};

const orderIndividualItems = async (productId: string, qty: IQty, token: string): Promise<IOrderResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + `/order/item/${productId}`, qty, config);
    return response.data;
};

const razorpPayOrder = async (id: string, token: string): Promise<any> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_ORDER_URL + `/checkout/order/${id}`, config);
    return response.data;
};

const razorPayVerify = async (id: string, token: string, details: any): Promise<{ success: boolean }> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_ORDER_URL + `/verify/payment/${id}`, details, config);
    return response.data;
};

// get buyer orders
const getAllOrdersBuyer = async (token: string): Promise<IOrderResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_ORDER_URL + "/get/user/orders", config);
    return response.data;
};

const orderService = {
    cartItemsCreateOrder,
    orderIndividualItems,
    razorpPayOrder,
    razorPayVerify,
    getAllOrdersBuyer
};

export default orderService;