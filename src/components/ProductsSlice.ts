import { createSlice } from "@reduxjs/toolkit";
import { products } from "../data/productsData";

const ProductsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
    },
    reducers: {
        setProductsData(state, actions){
            state.products = actions.payload;
        }
    }
})


export const { setProductsData } = ProductsSlice.actions;
export default ProductsSlice.reducer;
