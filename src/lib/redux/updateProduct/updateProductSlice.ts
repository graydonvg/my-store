import {
  AddNewProductDbType,
  AddNewProductImageDataType,
  AddNewProductStoreType,
  ImageUploadProgressType,
} from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  updateProductIsDeletingImage: boolean;
  updateProductImageUploadProgress: ImageUploadProgressType[];
  updateProductImageData: AddNewProductImageDataType[];
  updateProductFormData: AddNewProductDbType;
};

const initialState: State = {
  updateProductIsDeletingImage: false,
  updateProductImageUploadProgress: [],
  updateProductImageData: [],
  updateProductFormData: {
    category: '',
    delivery_info: '',
    description: '',
    name: '',
    on_sale: 'No',
    price: 0,
    sale_percentage: 0,
    sizes: [],
  },
};

export const updateProductSlice = createSlice({
  name: 'updateProduct',
  initialState,
  reducers: {
    setUpdateProductFormData(state, action) {
      state.updateProductFormData = action.payload;
    },
    setUpdateProductFormFieldData(
      state,
      action: PayloadAction<{
        field: keyof AddNewProductStoreType;
        value: AddNewProductStoreType[keyof AddNewProductStoreType];
      }>
    ) {
      const { field, value } = action.payload;
      if (field === 'sizes') {
        if (state.updateProductFormData.sizes.includes(value as string)) {
          const filteredSizes = state.updateProductFormData.sizes.filter((size) => size !== value);
          state.updateProductFormData.sizes = filteredSizes;
        } else {
          state.updateProductFormData.sizes = [...state.updateProductFormData.sizes, value as string];
        }
      } else {
        if (field === 'on_sale' && value === 'No') {
          state.updateProductFormData = { ...state.updateProductFormData, sale_percentage: 0 };
        }
        state.updateProductFormData = { ...state.updateProductFormData, [field]: value };
      }
    },
    setUpdateProductImageUploadProgress(state, action: PayloadAction<ImageUploadProgressType>) {
      const existingIndex = state.updateProductImageUploadProgress.findIndex(
        (upload) => upload.file_name === action.payload.file_name
      );

      if (existingIndex !== -1) {
        state.updateProductImageUploadProgress[existingIndex] = action.payload;
      } else {
        state.updateProductImageUploadProgress.push(action.payload);
      }
    },
    setUpdateProductImageData(state, action: PayloadAction<AddNewProductImageDataType>) {
      const existingIndex = state.updateProductImageData.findIndex(
        (image) => image.file_name === action.payload.file_name
      );

      if (existingIndex !== -1) {
        state.updateProductImageData[existingIndex] = action.payload;
      } else {
        state.updateProductImageData.push(action.payload);
      }
    },
    deleteUpdateProductImage(state, action: PayloadAction<{ file_name: string }>) {
      state.updateProductImageData = state.updateProductImageData.filter(
        (image) => image.file_name !== action.payload.file_name
      );
      state.updateProductImageUploadProgress = state.updateProductImageUploadProgress.filter(
        (upload) => upload.file_name !== action.payload.file_name
      );
    },
    setUpdateProductIsDeletingImage(state, action: PayloadAction<boolean>) {
      state.updateProductIsDeletingImage = action.payload;
    },
    resetUpdateProductImageData(state) {
      state.updateProductImageData = initialState.updateProductImageData;
      state.updateProductImageUploadProgress = initialState.updateProductImageUploadProgress;
    },
    resetUpdateProductFormData(state) {
      state.updateProductFormData = initialState.updateProductFormData;
    },
  },
});

const { actions, reducer } = updateProductSlice;

export const {
  deleteUpdateProductImage,
  resetUpdateProductFormData,
  resetUpdateProductImageData,
  setUpdateProductFormData,
  setUpdateProductFormFieldData,
  setUpdateProductImageData,
  setUpdateProductImageUploadProgress,
  setUpdateProductIsDeletingImage,
} = actions;

export const userReducer = reducer;
