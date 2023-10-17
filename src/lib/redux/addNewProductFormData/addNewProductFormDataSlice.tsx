import { AddNewProductFormDataType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  formData: {
    imageData: [],
    sizes: [],
    category: '',
    name: '',
    description: '',
    deliveryInfo: '',
    price: '',
    onSale: '',
    salePercentage: '',
  } as AddNewProductFormDataType,
};

export const addNewProductFormDataSlice = createSlice({
  name: 'addNewProductFormData',
  initialState,
  reducers: {
    setFormData(
      state,
      action: PayloadAction<{
        field: keyof AddNewProductFormDataType;
        value: any;
      }>
    ) {
      const { field, value } = action.payload;

      if (field === 'imageData') {
        const existingIndex = state.formData.imageData.findIndex((item) => item.fileName === value.fileName);

        if (existingIndex !== -1) {
          state.formData.imageData[existingIndex] = { ...value };
        } else {
          state.formData.imageData.push({ ...value });
        }
      } else {
        state.formData = { ...state.formData, [field]: value };
      }
    },
    deleteImage(state, action: PayloadAction<{ fileName: string }>) {
      state.formData.imageData = state.formData.imageData.filter(
        (data) => data.fileName !== action.payload.fileName
      ) as { imageUrl: string; fileName: string }[];
    },
    resetFormData(state) {
      state.formData = initialState.formData;
    },
  },
});

const { actions, reducer } = addNewProductFormDataSlice;

export const { setFormData, deleteImage, resetFormData } = actions;

export const userReducer = reducer;
