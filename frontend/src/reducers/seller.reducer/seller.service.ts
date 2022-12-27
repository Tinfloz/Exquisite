import axios from "axios";
import { IMyOrdersResponse, ISellerStockResponse, IStockParam } from "../../interfaces/redux.interfaces/seller.slice.interface";
import { IProduct } from "../../interfaces/redux.interfaces/product.interfaces";

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

const updateSellerStockProduct = async (token: string, id: string, stockDetails: IStockParam): Promise<ISellerStockResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL + `/update/stock/${id}`, stockDetails, config);
    const user = JSON.parse(localStorage.getItem("user")!);
    const newProducts = user.sendUser.loginUser.products.map((element: IProduct) => {
        if (element._id === response.data.id) {
            element.stock = response.data.stock
        };
        return element
    });
    const newLoginUser = { ...user.sendUser.loginUser, "products": newProducts };
    const newSendUser = { ...user.sendUser, "loginUser": newLoginUser };
    const newUser = { ...user, "sendUser": newSendUser };
    localStorage.setItem("user", JSON.stringify(newUser));
    return response.data;
};

const sellerService = {
    getAllMyOrders,
    getMyOrderAndProduct,
    markOrdersDeliveredSeller,
    getMyTopProductsBySales,
    getMyTopProductsByRatings,
    updateSellerStockProduct
};

export default sellerService;