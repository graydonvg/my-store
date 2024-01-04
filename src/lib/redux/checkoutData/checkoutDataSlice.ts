import { CheckoutDataType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: CheckoutDataType = {
  orderItems: [],
  paymentTotals: {
    cartTotal: 0,
    deliveryFee: 0,
    orderTotal: 0,
    totalDiscount: 0,
  },
  shippingAddress: null,
  isProcessing: false,
};

export const checkoutDataSlice = createSlice({
  name: 'checkoutData',
  initialState,
  reducers: {
    setCheckoutData(state, action: PayloadAction<Partial<CheckoutDataType>>) {
      return { ...state, ...action.payload };
    },
    resetCheckoutData() {
      return initialState;
    },
  },
});

const { actions, reducer } = checkoutDataSlice;

export const { setCheckoutData, resetCheckoutData } = actions;

export const userReducer = reducer;
