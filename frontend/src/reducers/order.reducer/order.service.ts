import axios from "axios";
import { IQty } from "../../interfaces/redux.interfaces/auth.slice.interface";
import { IOrderResponse } from "../../interfaces/redux.interfaces/order.slice.interface";

const API_URL = "http://localhost:5000/api/buyer";

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

const orderService = {
    cartItemsCreateOrder,
    orderIndividualItems
};

export default orderService;