import { AddNewProductFormDataType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  imageUploadProgress: [] as { fileName: string; uploadProgress: number }[],
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
    setImageUploadProgress(state, action: PayloadAction<{ fileName: string; uploadProgress: number; index: number }>) {
      const { fileName, uploadProgress, index } = action.payload;
      state.imageUploadProgress[index] = { fileName, uploadProgress };
    },
    resetImageUploadProgress(state, action: PayloadAction<{ fileName: string | null }>) {
      const { fileName } = action.payload;
      if (fileName) {
        const filteredArray = state.imageUploadProgress.filter((data) => data.fileName !== action.payload.fileName);
        state.imageUploadProgress = filteredArray;
      } else {
        state.imageUploadProgress = [];
      }
    },
    setFormData(state, action: PayloadAction<{ field: keyof AddNewProductFormDataType; value: any }>) {
      const { field, value } = action.payload;
      state.formData = { ...state.formData, [field]: value };
    },
    resetFormData(state) {
      state.formData = initialState.formData;
      state.imageUploadProgress = [];
    },
  },
});

const { actions, reducer } = addNewProductFormDataSlice;

export const { setImageUploadProgress, resetImageUploadProgress, setFormData, resetFormData } = actions;

export const userReducer = reducer;
