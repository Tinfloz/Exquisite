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

const sellerService = {
    getAllMyOrders
};

export default sellerService;