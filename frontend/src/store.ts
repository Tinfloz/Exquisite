import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/auth.reducer/auth.slice";
import productReducer from "./reducers/product.reducer/product.slice";

const store = configureStore({
    reducer: {
        auth: userReducer,
        products: productReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;
