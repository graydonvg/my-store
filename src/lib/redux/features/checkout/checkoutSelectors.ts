import { RootState } from '../../store';

export function selectCheckoutData(state: RootState) {
  return state.checkout;
}

export function selectIsCheckoutProcessing(state: RootState) {
  return state.checkout.isCheckoutProcessing;
}

export function selectOrderAddressId(state: RootState) {
  return state.checkout.orderAddressId;
}
