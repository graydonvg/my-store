import { InsertProductImageDataTypeStore, InsertProductTypeStore, ImageUploadProgressType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  isEditMode: boolean;
  isDeletingImage: boolean;
  imageUploadProgress: ImageUploadProgressType[];
  imageData: InsertProductImageDataTypeStore[];
  formData: InsertProductTypeStore;
  productToUpdateId: string | null;
};

const initialState: State = {
  isEditMode: false,
  isDeletingImage: false,
  imageUploadProgress: [],
  imageData: [],
  formData: {
    category: '',
    delivery_info: '',
    description: '',
    name: '',
    on_sale: '',
    price: '',
    sale_percentage: '',
    sizes: [],
  },
  productToUpdateId: null,
};

export const addProductSlice = createSlice({
  name: 'addProduct',
  initialState,
  reducers: {
    setFormData(
      state,
      action: PayloadAction<{
        field: keyof InsertProductTypeStore;
        value: InsertProductTypeStore[keyof InsertProductTypeStore];
      }>
    ) {
      const { field, value } = action.payload;
      if (field === 'sizes') {
        if (state.formData.sizes.includes(value as string)) {
          const filteredSizes = state.formData.sizes.filter((size) => size !== value);
          state.formData.sizes = filteredSizes;
        } else {
          state.formData.sizes = [...state.formData.sizes, value as string];
        }
      } else {
        if (field === 'on_sale' && value === 'No') {
          state.formData = { ...state.formData, sale_percentage: 0 };
        }
        state.formData = { ...state.formData, [field]: value };
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
    setProductToUpdateId(state, action: PayloadAction<string>) {
      state.productToUpdateId = action.payload;
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
    resetFormData(state) {
      state.formData = initialState.formData;
    },
    resetProductToUpdateId(state) {
      state.productToUpdateId = null;
    },
    resetAllProductData() {
      return initialState;
    },
  },
});

const { actions, reducer } = addProductSlice;

export const {
  setFormData,
  setImageUploadProgress,
  setImageData,
  deleteImage,
  setIsDeletingImage,
  resetImageData,
  resetImageUploadProgess,
  resetFormData,
  setProductToUpdateId,
  setIsEditMode,
  resetProductToUpdateId,
  resetAllProductData,
} = actions;

export const userReducer = reducer;
