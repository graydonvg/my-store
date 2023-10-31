import { AddNewProductImageDataType, AddNewProductStoreType, ImageUploadProgressType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type State = {
  isDeletingImage: boolean;
  imageUploadProgress: ImageUploadProgressType[];
  imageData: AddNewProductImageDataType[];
  formData: AddNewProductStoreType;
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
};

export const addNewProductSlice = createSlice({
  name: 'addNewProduct',
  initialState,
  reducers: {
    setFormData(
      state,
      action: PayloadAction<{
        field: keyof AddNewProductStoreType;
        value: AddNewProductStoreType[keyof AddNewProductStoreType];
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
    setImageData(state, action: PayloadAction<AddNewProductImageDataType>) {
      const existingIndex = state.imageData.findIndex((image) => image.file_name === action.payload.file_name);

      if (existingIndex !== -1) {
        state.imageData[existingIndex] = action.payload;
      } else {
        state.imageData.push(action.payload);
      }
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
    resetImageData(state) {
      state.imageData = initialState.imageData;
      state.imageUploadProgress = initialState.imageUploadProgress;
    },
    resetFormData(state) {
      state.formData = initialState.formData;
    },
  },
});

const { actions, reducer } = addNewProductSlice;

export const {
  setFormData,
  setImageUploadProgress,
  setImageData,
  deleteImage,
  setIsDeletingImage,
  resetImageData,
  resetFormData,
} = actions;

export const userReducer = reducer;
