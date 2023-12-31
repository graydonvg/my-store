import { CheckoutDataType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: CheckoutDataType = {
  shippingAddress: null,
  paymentMethod: '',
  totalToPay: 0,
  isProcessing: true,
  isPaid: false,
  paidAt: new Date().toISOString(),
};

export const checkoutDataSlice = createSlice({
  name: 'checkoutData',
  initialState,
  reducers: {
    setCheckoutData(state, action: PayloadAction<CheckoutDataType>) {
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
