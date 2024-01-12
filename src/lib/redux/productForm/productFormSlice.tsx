import { InsertProductImageDataTypeStore, InsertProductTypeStore, ImageUploadProgressType } from '@/types';
import { sortItemSizesArrayForStore } from '@/utils/sortItemSizesArray';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

function handleSetProductDataOnChange(
  field: keyof InsertProductTypeStore,
  value: InsertProductTypeStore[keyof InsertProductTypeStore],
  productFormData: InsertProductTypeStore,
  initialState: State
) {
  if (field === 'sizes') {
    return handleSizesChange(value as string, productFormData);
  } else if (field === 'isOnSale' && value === 'No') {
    return { ...productFormData, [field]: value, salePercentage: 0 };
  } else if (field === 'isOnSale' && value === 'Yes' && productFormData.salePercentage === 0) {
    return { ...productFormData, [field]: value, salePercentage: initialState.productFormData.salePercentage };
  } else {
    return { ...productFormData, [field]: value };
  }
}

function handleSizesChange(value: string, productFormData: InsertProductTypeStore) {
  if (productFormData.sizes.includes(value)) {
    const filteredSizes = productFormData.sizes.filter((size) => size !== value);
    return { ...productFormData, sizes: filteredSizes };
  } else {
    const sizes = [...productFormData.sizes, value];
    const sortedSizes = sizes.sort(sortItemSizesArrayForStore);
    return { ...productFormData, sizes: sortedSizes };
  }
}

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
    deliveryInfo: '',
    returnInfo: '',
    details: '',
    name: '',
    brand: '',
    isOnSale: '',
    price: '',
    salePercentage: '',
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
      state.productFormData = handleSetProductDataOnChange(field, value, state.productFormData, initialState);
    },
    setImageUploadProgress(state, action: PayloadAction<ImageUploadProgressType>) {
      state.imageUploadProgress = handleSetImageUploadProgress(action.payload, state.imageUploadProgress);
    },
    setImageData(state, action: PayloadAction<InsertProductImageDataTypeStore[]>) {
      state.imageData = [...state.imageData, ...action.payload];
    },
    deleteImage(state, action: PayloadAction<{ fileName: string }>) {
      state.imageData = state.imageData.filter((image) => image.fileName !== action.payload.fileName);
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
