import { CheckoutData } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: CheckoutData = {
  orderAddressId: null,
  orderItems: [],
  orderPaymentTotals: {
    cartTotal: 0,
    deliveryFee: 0,
    orderTotal: 0,
    discountTotal: 0,
  },
  orderShippingDetails: null,
  isCheckoutProcessing: false,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutData(state, action: PayloadAction<Partial<CheckoutData>>) {
      return { ...state, ...action.payload };
    },
    resetCheckoutData() {
      return initialState;
    },
  },
});

const { actions, reducer } = checkoutSlice;

export const { setCheckoutData, resetCheckoutData } = actions;

export const checkoutReducer = reducer;
