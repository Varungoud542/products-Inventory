import { configureStore } from "@reduxjs/toolkit";
import ProductsSlice from "../components/ProductsSlice";


const store = configureStore({
    reducer: {
        Products:ProductsSlice,
    },
})

export default store