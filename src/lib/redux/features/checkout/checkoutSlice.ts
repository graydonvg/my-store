import { CheckoutData } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: CheckoutData = {
  selectedAddressId: null,
  orderItems: [],
  paymentTotals: {
    cartTotal: 0,
    deliveryFee: 0,
    orderTotal: 0,
    discountTotal: 0,
  },
  shippingDetails: null,
  isProcessing: false,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutData(state, action: PayloadAction<Partial<CheckoutData>>) {
      return { ...state, ...action.payload };
    },
    resetCheckoutData() {
      return { ...initialState };
    },
  },
});

const { actions, reducer } = checkoutSlice;

export const { setCheckoutData, resetCheckoutData } = actions;

export const checkoutReducer = reducer;
