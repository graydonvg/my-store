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
    setFormData(state, action: PayloadAction<{ field: keyof AddNewProductFormDataType; value: any; index?: number }>) {
      const { field, value, index } = action.payload;

      if (field === 'imageData') {
        // Ensure that state.formData.imageData is an array
        if (!Array.isArray(state.formData.imageData)) {
          state.formData.imageData = [];
        }

        // Check if value.fileName already exists in the array
        const existingIndex = state.formData.imageData.findIndex((item) => item.fileName === value.fileName);

        if (existingIndex !== -1) {
          // If value.fileName already exists, update the existing object
          state.formData.imageData[existingIndex] = { ...state.formData.imageData[existingIndex], ...value };
        } else {
          // If value.fileName doesn't exist, push a new object
          state.formData.imageData.push({ ...value });
        }
      } else {
        // For fields other than 'imageData', update state.formData as before
        state.formData = { ...state.formData, [field]: value };
      }
    },
    resetFormData(state) {
      state.formData = initialState.formData;
    },
  },
});

const { actions, reducer } = addNewProductFormDataSlice;

export const { setFormData, resetFormData } = actions;

export const userReducer = reducer;
