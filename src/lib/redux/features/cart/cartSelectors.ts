import { createSelector } from 'reselect';
import { RootState } from '../../store';
import { calculateRoundedDiscountedPrice } from '@/utils/calculate';

export function selectIsCartOpen(state: RootState) {
  return state.cart.isCartOpen;
}

export function selectCartItems(state: RootState) {
  return state.cart.cartItems;
}

export const selectCartItemsWithPriceDetails = createSelector([selectCartItems], (items) =>
  items.map((item) => {
    if (item.product?.isOnSale) {
      return {
        ...item,
        totalStandardPrice: item.product.price * item.quantity,
        totalDiscountedPrice:
          calculateRoundedDiscountedPrice(item.product.price, item.product.salePercentage) * item.quantity,
      };
    } else {
      return {
        ...item,
        totalStandardPrice: item.product?.price! * item.quantity,
        totalDiscountedPrice: null,
      };
    }
  })
);

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((totalCount, item) => totalCount + (item ? item.quantity : 0), 0)
);

export const selectRoundedDiscountTotal = createSelector([selectCartItems], (items) =>
  items.reduce(
    (discountTotal, item) =>
      discountTotal +
      (item.product?.isOnSale
        ? Math.round(item.product.price * (item.product.salePercentage / 100)) * item.quantity
        : 0),
    0
  )
);

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((totalPrice, item) => totalPrice + item.product?.price! * item.quantity, 0)
);

export const selectDeliveryFee = createSelector(
  [selectCartTotal, selectRoundedDiscountTotal],
  (cartTotal, discountTotal) => (cartTotal - discountTotal > 500 ? 0 : 60)
);

export const selectOrderTotal = createSelector(
  [selectCartTotal, selectRoundedDiscountTotal],
  (cartTotal, discountTotal) => cartTotal - discountTotal
);
