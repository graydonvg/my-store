// import { AddNewProductImageDataType, AddNewProductStoreType, ImageUploadProgressType, ProductType } from '@/types';
// import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

// export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
//   const supabase = createClientComponentClient();
//   try {
//     const { data: products } = await supabase.from('products').select('*, product_image_data(file_name, image_url)');
//     return products;
//   } catch (error) {
//     // console.log('Error fetching products.', error);
//     return [] as ProductType[];
//   }
// });

// const initialState = {
// 	isLoading: false
// };

// export const productsSlice = createSlice({
//   name: 'products',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(fetchCategories.pending, (state) => {
//       state.isLoading = true;
//     });
//     builder.addCase(fetchCategories.fulfilled, (state, action) => {
//       state.isLoading = false;
//       state.categories = action.payload;
//     });
//     builder.addCase(fetchCategories.rejected, (state) => {
//       state.isLoading = false;
//     });
//   },
// });

// const { actions, reducer } = productsSlice;

// export const { setFormData, setImageUploadProgress } = actions;

// export const userReducer = reducer;
