import { createSlice, createAsyncThunk, PayloadAction, current } from "@reduxjs/toolkit";
import { ISetAddressParam, ISetAddressResponse, IUpdateCartParam, IUser } from "../../interfaces/redux.interfaces/auth.slice.interface";
import { IAuthInit, ICartResponse } from "../../interfaces/redux.interfaces/auth.slice.interface";
import { IUserCreds } from "../../interfaces/user.creds";
import { ValidationErrors } from "../../interfaces/redux.interfaces/redux.errors";
import authService from "./auth.service";
import { RootState } from "../../store";
import { ISellerCreateProductParam, ISellerResponse } from "../../interfaces/redux.interfaces/seller.slice.interface";
import { IProduct } from "../../interfaces/redux.interfaces/product.interfaces";

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

// create new products sellers
export const createSellerNewProducts = createAsyncThunk<
    ISellerResponse,
    ISellerCreateProductParam,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("seller/new/product", async (prodDetails, thunkAPI) => {
    try {
        const token: string = thunkAPI.getState().auth.user!.token;
        return authService.createNewProductsSeller(prodDetails, token);
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

export const updateItemQtyInCart = createAsyncThunk<
    ICartResponse,
    IUpdateCartParam,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("update/qty/cart", async (updateDetails, thunkAPI) => {
    try {
        const { cartId, quantity } = updateDetails;
        const token = thunkAPI.getState().auth.user!.token;
        return await authService.updateProductQtyCart(cartId, quantity, token)
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// delete products 
export const deleteProductsSeller = createAsyncThunk<
    ISellerResponse,
    string,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("delete/product", async (id, thunkAPI) => {
    try {
        const token: string = thunkAPI.getState().auth.user!.token;
        return await authService.deleteSellerProducts(id, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// set user address
export const setAddressUser = createAsyncThunk<
    ISetAddressResponse,
    ISetAddressParam,
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("address/set", async (addressDetails, thunkAPI) => {
    try {
        const token: string = thunkAPI.getState().auth.user!.token;
        return await authService.setLoginUserAddress(token, addressDetails);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// change user details 
export const changeDetailsAccount = createAsyncThunk<
    {
        success: boolean,
        email: string
    },
    {
        email?: string,
        password?: string,
    },
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("change/details", async (changeDetails, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user!.token;
        return await authService.changeUserDetails(token, changeDetails);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// get reset link
export const getResetLink = createAsyncThunk<
    {
        success: boolean
    },
    {
        email: string
    },
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("reset/link", async (email, thunkAPI) => {
    try {
        return await authService.getResetLinkUser(email);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
});

// reset password set
export const resetUserPasswordSet = createAsyncThunk<
    {
        success: boolean
    },
    {
        token: string,
        passwordChange: {
            password: string,
            confirmPassword: string
        };
    },
    {
        state: RootState,
        rejectValue: ValidationErrors
    }
>("reset/password", async (passwordDetails, thunkAPI) => {
    try {
        const { token, passwordChange } = passwordDetails;
        return await authService.setPasswordReset(passwordChange, token);
    } catch (error: any) {
        const message = (error.response && error.response.data && error.response.data.message)
            || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    };
})

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
            .addCase(clearUserCart.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
                const newLoginUser = { ...state.user!.loginUser, cart: [] };
                const newUser = { ...state.user!, loginUser: newLoginUser };
                state.user = newUser;
            })
            .addCase(clearUserCart.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!;
            })
            .addCase(updateItemQtyInCart.pending, state => {
                state.isLoading = true;
            })
            .addCase(updateItemQtyInCart.fulfilled, (state, action: PayloadAction<ICartResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                let newLoginUser = { ...state.user!.loginUser, cart: action.payload.cart };
                let newUser = { ...state.user!, loginUser: newLoginUser };
                state.user = newUser;
            })
            .addCase(updateItemQtyInCart.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(createSellerNewProducts.pending, state => {
                state.isLoading = true;
            })
            .addCase(createSellerNewProducts.fulfilled, (state, action: PayloadAction<ISellerResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newProducts = [...state.user!.loginUser.products, action.payload!.product];
                const newLoginUser = {
                    ...state.user!.loginUser,
                    products: newProducts
                };
                const newUser = {
                    ...state.user!,
                    loginUser: newLoginUser
                };
                state.user = newUser;
            })
            .addCase(createSellerNewProducts.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(deleteProductsSeller.pending, state => {
                state.isLoading = true;
            })
            .addCase(deleteProductsSeller.fulfilled, (state, action: PayloadAction<ISellerResponse>) => {
                state.isLoading = false;
                state.isSuccess = true;
                const newArrayProducts = state.user!.loginUser.products.filter((element: IProduct) => element._id !== action.payload.producId);
                const newLoginUser = {
                    ...state.user!.loginUser,
                    products: newArrayProducts
                };
                const newUser = {
                    ...state.user!,
                    loginUser: newLoginUser
                };
                state.user = newUser
            })
            .addCase(deleteProductsSeller.rejected, (state, { payload }) => {
                state.isError = true;
                state.isLoading = false;
                state.message = payload!
            })
            .addCase(setAddressUser.pending, state => {
                state.isLoading = true;
            })
            .addCase(setAddressUser.fulfilled, state => {
                state.isSuccess = true;
                state.isLoading = false;
            })
            .addCase(setAddressUser.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(changeDetailsAccount.pending, state => {
                state.isLoading = false;
            })
            .addCase(changeDetailsAccount.fulfilled, (state, action: PayloadAction<{ success: boolean, email: string }>) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = {
                    ...state.user!,
                    email: action.payload.email
                };
            })
            .addCase(changeDetailsAccount.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(getResetLink.pending, state => {
                state.isLoading = true;
            })
            .addCase(getResetLink.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(getResetLink.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
            .addCase(resetUserPasswordSet.pending, state => {
                state.isLoading = true;
            })
            .addCase(resetUserPasswordSet.fulfilled, state => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(resetUserPasswordSet.rejected, (state, { payload }) => {
                state.isLoading = false;
                state.isError = true;
                state.message = payload!
            })
    }
});

export const { reset, resetUserHelpers, logout } = userSlice.actions;
export default userSlice.reducer;
