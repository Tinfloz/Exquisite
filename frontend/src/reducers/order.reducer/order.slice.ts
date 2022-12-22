import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import orderService from "./order.service";
import { IOrderInit, IOrderResponse, IOrderSingleItemParam } from "../../interfaces/redux.interfaces/order.slice.interface";
import { RootState } from "../../store";
import { ValidationErrors } from "../../interfaces/redux.interfaces/redux.errors";

const initialState: IOrderInit = {
    order: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};

// create order from cart
export const orderCartItems = createAsyncThunk<
    IOrderResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("order/cart", async (_, thunkAPI) => {
    try {
        const token: string = thunkAPI.getState().auth.user!.token;
        return await orderService.cartItemsCreateOrder(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

export const orderSingleItemById = createAsyncThunk<
    IOrderResponse,
    IOrderSingleItemParam,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("order/item", async (orderDetails, thunkAPI) => {
    try {
        const { id, quantity } = orderDetails;
        const token = thunkAPI.getState().auth.user!.token;
        return await orderService.orderIndividualItems(id, quantity, token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
})

const orderSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        resetOrder: state => initialState,
        resetOrderHelpers: state => ({
            ...initialState,
            order: state.order
        })
    },
    extraReducers: builder => {
        builder
            .addCase(orderCartItems.pending, state => {
                state.isLoading = true;
            })
            .addCase(orderCartItems.fulfilled, (state, action: PayloadAction<IOrderResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload.result;
            })
            .addCase(orderCartItems.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(orderSingleItemById.pending, state => {
                state.isLoading = true;
            })
            .addCase(orderSingleItemById.fulfilled, (state, action: PayloadAction<IOrderResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.order = action.payload.result;
            })
            .addCase(orderSingleItemById.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
    }
});

export const { resetOrder, resetOrderHelpers } = orderSlice.actions;
export default orderSlice.reducer;