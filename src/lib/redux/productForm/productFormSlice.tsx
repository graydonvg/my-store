import { InsertProductImageDataTypeStore, InsertProductTypeStore, ImageUploadProgressType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  isEditMode: boolean;
  isDeletingImage: boolean;
  imageUploadProgress: ImageUploadProgressType[];
  imageData: InsertProductImageDataTypeStore[];
  productFormData: InsertProductTypeStore;
};

const initialState: State = {
  isEditMode: false,
  isDeletingImage: false,
  imageUploadProgress: [],
  imageData: [],
  productFormData: {
    category: '',
    delivery_info: '',
    return_info: '',
    details: '',
    name: '',
    brand: '',
    on_sale: '',
    price: '',
    sale_percentage: '',
    sizes: [],
  },
};

export const productFormSlice = createSlice({
  name: 'productForm',
  initialState,
  reducers: {
    setProductFormData(state, action: PayloadAction<InsertProductTypeStore>) {
      state.productFormData = action.payload;
    },
    setProductFormDataOnChange(
      state,
      action: PayloadAction<{
        field: keyof InsertProductTypeStore;
        value: InsertProductTypeStore[keyof InsertProductTypeStore];
      }>
    ) {
      const { field, value } = action.payload;
      if (field === 'sizes') {
        if (state.productFormData.sizes.includes(value as string)) {
          const filteredSizes = state.productFormData.sizes.filter((size) => size !== value);
          state.productFormData.sizes = filteredSizes;
        } else {
          state.productFormData.sizes = [...state.productFormData.sizes, value as string];
        }
      } else {
        if (field === 'on_sale' && value === 'No') {
          state.productFormData = { ...state.productFormData, sale_percentage: 0 };
        }
        state.productFormData = { ...state.productFormData, [field]: value };
      }
    },
    setImageUploadProgress(state, action: PayloadAction<ImageUploadProgressType>) {
      const existingIndex = state.imageUploadProgress.findIndex(
        (upload) => upload.file_name === action.payload.file_name
      );

      if (existingIndex !== -1) {
        state.imageUploadProgress[existingIndex] = action.payload;
      } else {
        state.imageUploadProgress.push(action.payload);
      }
    },
    setImageData(state, action: PayloadAction<InsertProductImageDataTypeStore[]>) {
      state.imageData = [...state.imageData, ...action.payload];
    },
    deleteImage(state, action: PayloadAction<{ file_name: string }>) {
      state.imageData = state.imageData.filter((image) => image.file_name !== action.payload.file_name);
    },
    setIsDeletingImage(state, action: PayloadAction<boolean>) {
      state.isDeletingImage = action.payload;
    },
    setIsEditMode(state, action) {
      state.isEditMode = action.payload;
    },
    resetImageData(state) {
      state.imageData = initialState.imageData;
    },
    resetImageUploadProgess(state) {
      state.imageUploadProgress = initialState.imageUploadProgress;
    },
    resetProductFormData(state) {
      state.productFormData = initialState.productFormData;
    },
    resetAllProductData() {
      return initialState;
    },
  },
});

const { actions, reducer } = productFormSlice;

export const {
  setProductFormData,
  setProductFormDataOnChange,
  setImageUploadProgress,
  setImageData,
  deleteImage,
  setIsDeletingImage,
  resetImageData,
  resetImageUploadProgess,
  resetProductFormData,
  setIsEditMode,
  resetAllProductData,
} = actions;

export const userReducer = reducer;
