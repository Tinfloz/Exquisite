import { createSlice, createAsyncThunk, PayloadAction, isAsyncThunkAction } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces/redux.interfaces/auth.slice.interface";
import { IAuthInit, ICartResponse } from "../../interfaces/redux.interfaces/auth.slice.interface";
import { IUserCreds } from "../../interfaces/user.creds";
import { ValidationErrors } from "../../interfaces/redux.interfaces/redux.errors";
import authService from "./auth.service";
import { RootState } from "../../store";

const user = JSON.parse(localStorage.getItem("user")!);

console.log(user, "user")

const initialState: IAuthInit = {
    user: user ? user.sendUser : null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
};

// register thunk
export const userRegister = createAsyncThunk<
    IUser,
    IUserCreds,
    { rejectValue: ValidationErrors }
>("user/register", async (userCreds, thunkAPI) => {
    try {
        return await authService.registerUser(userCreds)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

export const userLogin = createAsyncThunk<
    IUser,
    IUserCreds,
    { rejectValue: ValidationErrors }
>("user/login", async (userCreds, thunkAPI) => {
    try {
        return await authService.loginUser(userCreds)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// add items to cart 
export const addItemsToCartById = createAsyncThunk<
    ICartResponse,
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("add/item", async (id, thunkAPI) => {
    try {
        const token: string = thunkAPI.getState().auth!.user!.token;
        return await authService.addIndividualItemsToCart(id, token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// delete inidividual cart items
export const deleteIndividualItemsById = createAsyncThunk<
    ICartResponse,
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("user/delete/item", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth!.user!.token;
        return await authService.deleteIndividualCartItems(id, token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

export const clearUserCart = createAsyncThunk<
    ICartResponse,
    void,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("delete/all", async (_, thunkAPI) => {
    try {
        const token: string = thunkAPI.getState().auth!.user!.token;
        return await authService.clearAllItems(token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: state => initialState,
        resetUserHelpers: state => ({
            ...initialState,
            user: state.user
        }),
        logout: () => { localStorage.removeItem("user") }
    },
    extraReducers: builder => {
        builder
            .addCase(userRegister.pending, state => {
                state.isLoading = true
            })
            .addCase(userRegister.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = payload.sendUser;
            })
            .addCase(userRegister.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true
                state.message = payload!
            })
            .addCase(userLogin.pending, state => {
                state.isLoading = true
            })
            .addCase(userLogin.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = payload.sendUser
            })
            .addCase(userLogin.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(addItemsToCartById.pending, state => {
                state.isLoading = true;
            })
            .addCase(addItemsToCartById.fulfilled, (state, action: PayloadAction<ICartResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                let newLoginUser = { ...state.user!.loginUser, cart: action.payload.cart }
                let newUser = { ...state.user!, loginUser: newLoginUser };
                state.user = newUser;
            })
            .addCase(addItemsToCartById.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(deleteIndividualItemsById.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteIndividualItemsById.fulfilled, (state, action: PayloadAction<ICartResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                let newLoginUser = { ...state.user!.loginUser, cart: action.payload.cart };
                let newUser = { ...state.user!, loginUser: newLoginUser }
                state.user = newUser;
            })
            .addCase(deleteIndividualItemsById.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(clearUserCart.pending, state => {
                state.isLoading = true;
            })
            .addCase(clearUserCart.fulfilled, (state, action: PayloadAction<ICartResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newLoginUser = { ...state.user!.loginUser, cart: [] };
                const newUser = { ...state.user!, loginUser: newLoginUser };
                state.user = newUser;
                state.message = action.payload.message!
            })
            .addCase(clearUserCart.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!;
            })
    }
});

export const { reset, resetUserHelpers, logout } = userSlice.actions;
export default userSlice.reducer;
