import { ProductForm } from '@/types';
import { sortItemSizesArrayForStore } from '@/utils/sortingHelpers';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

function handleSetProductDataOnChange(
  field: keyof ProductForm,
  value: ProductForm[keyof ProductForm],
  productFormData: ProductForm,
  initialState: State
) {
  if (field === 'sizes') {
    return setAvailableSizes(value as string, productFormData);
  }

  if (field === 'isOnSale' && value === 'No') {
    return { ...productFormData, isOnSale: false, salePercentage: 0 };
  }

  if (field === 'isOnSale' && value === 'Yes') {
    if (productFormData.salePercentage === 0) {
      return {
        ...productFormData,
        isOnSale: true,
        salePercentage: initialState.productFormData.salePercentage,
      };
    }
    return {
      ...productFormData,
      isOnSale: true,
    };
  }

  if (field === 'price' || field === 'salePercentage') {
    return { ...productFormData, [field]: Number(value) };
  }

  return { ...productFormData, [field]: value };
}

function setAvailableSizes(value: string, productFormData: ProductForm) {
  if (productFormData.sizes.includes(value)) {
    const filteredSizes = productFormData.sizes.filter((size) => size !== value);

    return { ...productFormData, sizes: filteredSizes };
  }

  const sizes = [...productFormData.sizes, value];

  const sortedSizes = sizes.sort(sortItemSizesArrayForStore);

  return { ...productFormData, sizes: sortedSizes };
}

type State = {
  isSubmitting: boolean;
  productFormData: ProductForm;
};

const initialState: State = {
  isSubmitting: false,
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
      action: PayloadAction<ProductForm | { field: keyof ProductForm; value: ProductForm[keyof ProductForm] }>
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
    setIsProductFormSubmitting(state, action: PayloadAction<State['isSubmitting']>) {
      state.isSubmitting = action.payload;
    },
  },
});

const { actions, reducer } = productFormSlice;

export const { setProductFormData, clearProductFormData, setIsProductFormSubmitting } = actions;

export const productFormReducer = reducer;
