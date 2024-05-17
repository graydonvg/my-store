import { InsertProductImageDataStore, ProductImageUploadProgress } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

function updateImageUploadProgress(
  payload: ProductImageUploadProgress,
  imageUploadProgress: ProductImageUploadProgress[]
) {
  const existingIndex = imageUploadProgress.findIndex((upload) => upload.fileName === payload.fileName);

  if (existingIndex !== -1) {
    imageUploadProgress[existingIndex] = payload;
  } else {
    imageUploadProgress.push(payload);
  }

  return [...imageUploadProgress];
}

function updateImageIndexesAndSort(imageData: InsertProductImageDataStore[]) {
  return imageData
    .map((data, newIndex) => (data.index === newIndex ? data : { ...data, index: newIndex }))
    .sort((a, b) => a.index - b.index);
}

function deleteImage(fileName: string, imageData: InsertProductImageDataStore[]) {
  const filteredImageData = imageData.filter((image) => image.fileName !== fileName);

  return updateImageIndexesAndSort(filteredImageData);
}

type State = {
  isDeletingImage: boolean;
  isEditImagesDrawerOpen: boolean;
  imageUploadProgress: ProductImageUploadProgress[];
  imageData: InsertProductImageDataStore[];
};

const initialState: State = {
  isDeletingImage: false,
  isEditImagesDrawerOpen: false,
  imageUploadProgress: [],
  imageData: [],
};

const productImagesSlice = createSlice({
  name: 'productImages',
  initialState,
  reducers: {
    setImageUploadProgress(state, action: PayloadAction<ProductImageUploadProgress>) {
      state.imageUploadProgress = updateImageUploadProgress(action.payload, state.imageUploadProgress);
    },
    setImageData(state, action: PayloadAction<InsertProductImageDataStore[]>) {
      state.imageData = [...state.imageData, ...action.payload];
    },
    setUpdatedImageData(state, action: PayloadAction<InsertProductImageDataStore[]>) {
      state.imageData = updateImageIndexesAndSort(action.payload);
    },
    deleteImageData(state, action: PayloadAction<{ fileName: string }>) {
      state.imageData = deleteImage(action.payload.fileName, state.imageData);
    },
    setIsDeletingImage(state, action: PayloadAction<boolean>) {
      state.isDeletingImage = action.payload;
    },
    setIsEditImagesDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isEditImagesDrawerOpen = action.payload;
    },
    clearImageData(state) {
      state.imageData = initialState.imageData;
    },
    clearImageUploadProgess(state) {
      state.imageUploadProgress = initialState.imageUploadProgress;
    },
    clearAllProductImagesData() {
      return initialState;
    },
  },
});

const { actions, reducer } = productImagesSlice;

export const {
  setImageUploadProgress,
  setImageData,
  setUpdatedImageData,
  deleteImageData,
  setIsDeletingImage,
  setIsEditImagesDrawerOpen,
  clearImageData,
  clearImageUploadProgess,
  clearAllProductImagesData,
} = actions;

export const productImagesReducer = reducer;
