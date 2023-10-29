import { AddNewProductStoreType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isDeletingImage: false,
  formData: {
    category: '',
    delivery_info: '',
    description: '',
    name: '',
    on_sale: '',
    price: '',
    sale_percentage: '',
    sizes: [],
  } as AddNewProductStoreType,
};

export const addNewProductSlice = createSlice({
  name: 'addNewProduct',
  initialState,
  reducers: {
    setFormData(
      state,
      action: PayloadAction<{
        field: keyof AddNewProductStoreType;
        value: any;
      }>
    ) {
      const { field, value } = action.payload;
      if (field === 'sizes') {
        if (state.formData.sizes.includes(value)) {
          const filteredSizes = state.formData.sizes.filter((size) => size !== value);
          state.formData.sizes = filteredSizes;
        } else {
          state.formData.sizes = [...state.formData.sizes, value];
        }
      } else {
        state.formData = { ...state.formData, [field]: value };
      }
    },
    // deleteImage(state, action: PayloadAction<{ fileName: string }>) {
    //   state.formData.imageData = state.formData.imageData.filter(
    //     (data) => data.fileName !== action.payload.fileName
    //   ) as { imageUrl: string; fileName: string }[];
    // },
    setIsDeletingImage(state, action: PayloadAction<boolean>) {
      state.isDeletingImage = action.payload;
    },
    resetFormData(state) {
      state.formData = initialState.formData;
    },
  },
});

const { actions, reducer } = addNewProductSlice;

export const { setFormData, setIsDeletingImage, resetFormData } = actions;

export const userReducer = reducer;
