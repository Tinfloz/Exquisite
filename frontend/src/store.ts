import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/auth.reducer/auth.slice";
import productReducer from "./reducers/product.reducer/product.slice";
import orderReducer from "./reducers/order.reducer/order.slice";

const store = configureStore({
    reducer: {
        auth: userReducer,
        products: productReducer,
        orders: orderReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;
