import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ValidationErrors } from "../../interfaces/redux.interfaces/redux.errors";
import { IMyOrdersResponse, ISellerSliceOrdersInit } from "../../interfaces/redux.interfaces/seller.slice.interface";
import { RootState } from "../../store";
import sellerService from "./seller.service";

const initialState: ISellerSliceOrdersInit = {
    orderStack: null,
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

const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        resetSeller: state => initialState,
        resetSellerHelpers: state => ({
            ...initialState,
            orderStack: state.orderStack
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
                state.orderStack = action.payload.ordersArray
            })
            .addCase(getAllSellerOrders.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
    }
});

export const { resetSeller, resetSellerHelpers } = sellerSlice.actions;
export default sellerSlice.reducer;