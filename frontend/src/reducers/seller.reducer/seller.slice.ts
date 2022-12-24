import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../interfaces/redux.interfaces/redux.errors";
import { IMyOrdersResponse, IParamGetProductOrder, ISellerSliceOrdersInit } from "../../interfaces/redux.interfaces/seller.slice.interface";
import { RootState } from "../../store";
import sellerService from "./seller.service";

const initialState: ISellerSliceOrdersInit = {
    orderStack: null,
    productStack: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};

// get all my orders
export const getAllSellerOrders = createAsyncThunk<
    IMyOrdersResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("my/orders", async (_, thunkAPI) => {
    try {
        const token: string = thunkAPI.getState().auth.user!.token;
        return await sellerService.getAllMyOrders(token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// get my order and product 
export const getMyProductsAndOrders = createAsyncThunk<
    IMyOrdersResponse,
    IParamGetProductOrder,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("get/order/product", async (productDetails, thunkAPI) => {
    try {
        const { orderId, productId } = productDetails;
        const token = thunkAPI.getState().auth.user!.token;
        return await sellerService.getMyOrderAndProduct(orderId!, productId!, token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// mark delivered
export const markSellerOrdersDelivered = createAsyncThunk<
    IMyOrdersResponse,
    IParamGetProductOrder,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("mark/delivered", async (deliveryDetails, thunkAPI) => {
    try {
        const { orderId, productId } = deliveryDetails
        const token = thunkAPI.getState().auth.user!.token;
        return await sellerService.markOrdersDeliveredSeller(orderId, productId, token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// get top products by sales
export const getMyProductsBySales = createAsyncThunk<
    IMyOrdersResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("top/sales", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user?.token!;
        return await sellerService.getMyTopProductsBySales(token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// get top products by ratings
export const getMyProductsByRatings = createAsyncThunk<
    IMyOrdersResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("top/ratings", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user!.token;
        return await sellerService.getMyTopProductsByRatings(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        resetSeller: state => initialState,
        resetSellerHelpers: state => ({
            ...initialState,
            orderStack: state.orderStack,
            productStack: state.productStack
        })
    },
    extraReducers: builder => {
        builder
            .addCase(getAllSellerOrders.pending, state => {
                state.isLoading = true;
            })
            .addCase(getAllSellerOrders.fulfilled, (state, action: PayloadAction<IMyOrdersResponse>) => {
                state.isSuccess = true;
                state.isLoading = false;
                state.orderStack = action.payload.ordersArray!
            })
            .addCase(getAllSellerOrders.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(getMyProductsAndOrders.pending, state => {
                state.isLoading = true;
            })
            .addCase(getMyProductsAndOrders.fulfilled, (state, action: PayloadAction<IMyOrdersResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.productStack = action.payload.productStack!
            })
            .addCase(getMyProductsAndOrders.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
            .addCase(markSellerOrdersDelivered.pending, state => {
                state.isLoading = true;
            })
            .addCase(markSellerOrdersDelivered.fulfilled, state => {
                state.isSuccess = true;
                state.isLoading = true;
            })
            .addCase(markSellerOrdersDelivered.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
            .addCase(getMyProductsBySales.pending, state => {
                state.isLoading = true;
            })
            .addCase(getMyProductsBySales.fulfilled, (state, action: PayloadAction<IMyOrdersResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.productStack = action.payload.productsArray!
            })
            .addCase(getMyProductsBySales.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(getMyProductsByRatings.pending, state => {
                state.isLoading = true;
            })
            .addCase(getMyProductsByRatings.fulfilled, (state, action: PayloadAction<IMyOrdersResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.productStack = action.payload!.productsArray!;
            })
            .addCase(getMyProductsByRatings.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
    }
});

export const { resetSeller, resetSellerHelpers } = sellerSlice.actions;
export default sellerSlice.reducer;