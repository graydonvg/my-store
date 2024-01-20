import { InsertProductImageDataTypeStore, InsertProductTypeStore, ImageUploadProgressType, DrawerState } from '@/types';
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
  } else if (field === 'brand') {
    return { ...productFormData, [field]: (value as string).toUpperCase() };
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
  isEditImageDrawerOpen: DrawerState;
  isDeletingImage: boolean;
  imageUploadProgress: ImageUploadProgressType[];
  imageData: InsertProductImageDataTypeStore[];
  productFormData: InsertProductTypeStore;
};

const initialState: State = {
  isEditImageDrawerOpen: {
    top: false,
    left: false,
    bottom: false,
    right: false,
  },
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
    setProductFormData(
      state,
      action: PayloadAction<
        | InsertProductTypeStore
        | { field: keyof InsertProductTypeStore; value: InsertProductTypeStore[keyof InsertProductTypeStore] }
      >
    ) {
      if ('field' in action.payload && 'value' in action.payload) {
        const { field, value } = action.payload;
        state.productFormData = handleSetProductDataOnChange(field, value, state.productFormData, initialState);
      } else {
        state.productFormData = action.payload;
      }
    },
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
    setIsEditImageDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isEditImageDrawerOpen.right = action.payload;
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
  setImageUploadProgress,
  setImageData,
  setUpdatedImageData,
  deleteImage,
  setIsDeletingImage,
  resetImageData,
  resetImageUploadProgess,
  resetProductFormData,
  setIsEditImageDrawerOpen,
  resetAllProductData,
} = actions;

export const userReducer = reducer;
