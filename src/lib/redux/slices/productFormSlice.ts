import { InsertProductTypeStore } from '@/types';
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

type State = {
  productFormData: InsertProductTypeStore;
};

const initialState: State = {
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

const productFormSlice = createSlice({
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
    clearProductFormData(state) {
      state.productFormData = initialState.productFormData;
    },
  },
});

const { actions, reducer } = productFormSlice;

export const { setProductFormData, clearProductFormData } = actions;

export const productFormReducer = reducer;
