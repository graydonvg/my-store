import {
  AddProductImageDataStoreType,
  AddProductStoreType,
  AddProductImageUploadProgressType,
  ProductType,
} from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  isDeletingImage: boolean;
  imageUploadProgress: AddProductImageUploadProgressType[];
  imageData: AddProductImageDataStoreType[];
  formData: AddProductStoreType;
  productToUpdateId: string | null;
};

const initialState: State = {
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
        field: keyof AddProductStoreType;
        value: AddProductStoreType[keyof AddProductStoreType];
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
    setImageUploadProgress(state, action: PayloadAction<AddProductImageUploadProgressType>) {
      const existingIndex = state.imageUploadProgress.findIndex(
        (upload) => upload.file_name === action.payload.file_name
      );

      if (existingIndex !== -1) {
        state.imageUploadProgress[existingIndex] = action.payload;
      } else {
        state.imageUploadProgress.push(action.payload);
      }
    },
    setImageData(state, action: PayloadAction<AddProductImageDataStoreType>) {
      const data = [...state.imageData, action.payload];
      const sortedData = data
        .slice()
        .sort((a, b) => a.index - b.index)
        .map((object) => object);

      state.imageData = sortedData;
    },
    deleteImage(state, action: PayloadAction<{ file_name: string }>) {
      state.imageData = state.imageData.filter((image) => image.file_name !== action.payload.file_name);
      state.imageUploadProgress = state.imageUploadProgress.filter(
        (upload) => upload.file_name !== action.payload.file_name
      );
    },
    setIsDeletingImage(state, action: PayloadAction<boolean>) {
      state.isDeletingImage = action.payload;
    },
    setProductToUpdateId(state, action: PayloadAction<string>) {
      state.productToUpdateId = action.payload;
    },
    resetImageData(state) {
      state.imageData = initialState.imageData;
      state.imageUploadProgress = initialState.imageUploadProgress;
    },
    resetFormData(state) {
      state.formData = initialState.formData;
    },
    resetProductToUpdateId(state) {
      state.productToUpdateId = null;
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
  resetFormData,
  setProductToUpdateId,
  resetProductToUpdateId,
} = actions;

export const userReducer = reducer;
