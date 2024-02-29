import { InsertProductImageDataTypeStore, ImageUploadProgressType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

function handleSetImageUploadProgress(
  payload: ImageUploadProgressType,
  imageUploadProgress: ImageUploadProgressType[]
) {
  const existingIndex = imageUploadProgress.findIndex((upload) => upload.fileName === payload.fileName);
  if (existingIndex !== -1) {
    imageUploadProgress[existingIndex] = payload;
  } else {
    imageUploadProgress.push(payload);
  }

  return [...imageUploadProgress];
}

function handleUpdateImageIndexesAndSort(imageData: InsertProductImageDataTypeStore[]) {
  return imageData
    .map((data, newIndex) => (data.index === newIndex ? data : { ...data, index: newIndex }))
    .sort((a, b) => a.index - b.index);
}

function handleDeleteImage(fileName: string, imageData: InsertProductImageDataTypeStore[]) {
  const filteredImageData = imageData.filter((image) => image.fileName !== fileName);

  return handleUpdateImageIndexesAndSort(filteredImageData);
}

type State = {
  isDeletingImage: boolean;
  imageUploadProgress: ImageUploadProgressType[];
  imageData: InsertProductImageDataTypeStore[];
};

const initialState: State = {
  isDeletingImage: false,
  imageUploadProgress: [],
  imageData: [],
};

const productImagesSlice = createSlice({
  name: 'productImages',
  initialState,
  reducers: {
    setImageUploadProgress(state, action: PayloadAction<ImageUploadProgressType>) {
      state.imageUploadProgress = handleSetImageUploadProgress(action.payload, state.imageUploadProgress);
    },
    setImageData(state, action: PayloadAction<InsertProductImageDataTypeStore[]>) {
      state.imageData = [...state.imageData, ...action.payload];
    },
    setUpdatedImageData(state, action: PayloadAction<InsertProductImageDataTypeStore[]>) {
      state.imageData = handleUpdateImageIndexesAndSort(action.payload);
    },
    deleteImage(state, action: PayloadAction<{ fileName: string }>) {
      state.imageData = handleDeleteImage(action.payload.fileName, state.imageData);
    },
    setIsDeletingImage(state, action: PayloadAction<boolean>) {
      state.isDeletingImage = action.payload;
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
  deleteImage,
  setIsDeletingImage,
  clearImageData,
  clearImageUploadProgess,
  clearAllProductImagesData,
} = actions;

export const productImagesReducer = reducer;
