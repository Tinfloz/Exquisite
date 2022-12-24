import axios from "axios";
import { IMyOrdersResponse } from "../../interfaces/redux.interfaces/seller.slice.interface";

const API_URL = "http://localhost:5000/api/seller"

const getAllMyOrders = async (token: string): Promise<IMyOrdersResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/get/my/orders", config);
    return response.data;
};

const getMyOrderAndProduct = async (orderId: string, productId: string, token: string): Promise<IMyOrdersResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/get/order/product/${orderId}/${productId}`, config);
    return response.data;
};

const markOrdersDeliveredSeller = async (orderId: string, productId: string, token: string): Promise<IMyOrdersResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/mark/delivered/${orderId}/${productId}`, config);
    return response.data;
};

// get top producst by sales
const getMyTopProductsBySales = async (token: string): Promise<IMyOrdersResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/get/top/products/sales", config);
    return response.data;
};

const getMyTopProductsByRatings = async (token: string): Promise<IMyOrdersResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + "/get/top/products/ratings", config);
    return response.data;
};

const sellerService = {
    getAllMyOrders,
    getMyOrderAndProduct,
    markOrdersDeliveredSeller,
    getMyTopProductsBySales,
    getMyTopProductsByRatings
};

export default sellerService;