// import { getProductsFromDatabase } from '@/lib/firebase';
// import { ProductDataType } from '@/types';
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
//   try {
//     const productsArray = await getProductsFromDatabase();
//     console.log(productsArray);

//     return productsArray;
//   } catch (error) {
//     return [] as ProductDataType[];
//   }
// });

// export type ProductsState = {
//   products: ProductDataType[];
//   isLoading: boolean;
// };

// export const initialState: ProductsState = {
//   products: [],
//   isLoading: false,
// };

// export const productsSlice = createSlice({
//   name: 'products',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchProducts.pending, (state) => {
//       state.isLoading = true;
//     });
//     builder.addCase(fetchProducts.fulfilled, (state, action) => {
//       state.isLoading = false;
//       state.products = action.payload;
//     });
//     builder.addCase(fetchProducts.rejected, (state) => {
//       state.isLoading = false;
//     });
//   },
// });

// const { reducer } = productsSlice;

// export const productsReducer = reducer;
