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
  },
});

const { actions, reducer } = checkoutDataSlice;

export const { setCheckoutData } = actions;

export const userReducer = reducer;
