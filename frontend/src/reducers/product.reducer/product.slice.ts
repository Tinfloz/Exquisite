import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IProduct, IProductInitialState, IProductResponse } from "../../interfaces/redux.interfaces/product.interfaces";
import { ValidationErrors } from "../../interfaces/redux.interfaces/redux.errors";
import productService from "./product.service";
import { RootState } from "../../store";

const initialState: IProductInitialState = {
    product: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};

// get all the products
export const getAllHomeProducts = createAsyncThunk<
    IProductResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("get/all", async (_, thunkAPI) => {
    try {
        const token: string = thunkAPI.getState().auth.user!.token;
        return await productService.getAllProducts(token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// get individual products
export const getIndProductsById = createAsyncThunk<
    IProductResponse,
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("get/by/id", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user!.token;
        return await productService.getIndividualProduct(token, id)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// get all cart items user
export const getAllUserItemsCart = createAsyncThunk<
    IProductResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("get/cart", async (_, thunkAPI) => {
    try {
        const token: string = thunkAPI.getState().auth.user!.token;
        return await productService.getUserCartItems(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});


const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        resetProducts: state => initialState,
        resetProductHelpers: state => ({
            ...initialState,
            product: state.product
        })
    },
    extraReducers: builder => {
        builder
            .addCase(getAllHomeProducts.pending, state => {
                state.isLoading = true
            })
            .addCase(getAllHomeProducts.fulfilled, (state, action: PayloadAction<IProductResponse>) => {
                state.product = action.payload.products!;
                state.isSuccess = true;
                state.isLoading = false;
            })
            .addCase(getAllHomeProducts.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(getIndProductsById.pending, state => {
                state.isLoading = true;
            })
            .addCase(getIndProductsById.fulfilled, (state, action: PayloadAction<IProductResponse>) => {
                state.product = action.payload.product!;
                state.isSuccess = true;
                state.isLoading = false;
            })
            .addCase(getIndProductsById.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(getAllUserItemsCart.pending, state => {
                state.isLoading = true;
            })
            .addCase(getAllUserItemsCart.fulfilled, (state, action: PayloadAction<IProductResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.product = action.payload.cart!
            })
            .addCase(getAllUserItemsCart.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
    }
});

export const { resetProductHelpers, resetProducts } = productSlice.actions;
export default productSlice.reducer;