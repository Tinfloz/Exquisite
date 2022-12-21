import axios from "axios";
import { IProduct, IProductResponse } from "../../interfaces/redux.interfaces/product.interfaces";

const API_URL = "http://localhost:5000/api/product"
const API_BUYER_URL = "http://localhost:5000/api/buyer"

// get all products
const getAllProducts = async (token: string): Promise<IProductResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    console.log("config", config)
    const response = await axios.get(API_URL + "/get/products", config);
    return response.data;
};

// get products by id
const getIndividualProduct = async (token: string, id: string): Promise<IProductResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_URL + `/get/products/${id}`, config);
    return response.data;
};

// get all cart items 
const getUserCartItems = async (token: string): Promise<IProductResponse> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(API_BUYER_URL + "/get/all/items", config);
    return response.data;
};

const productService = {
    getIndividualProduct,
    getAllProducts,
    getUserCartItems
};

export default productService;