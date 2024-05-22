import { createSelector } from 'reselect';
import { RootState } from '../../store';

export function selectIsCartOpen(state: RootState) {
  return state.cart.isCartOpen;
}

export function selectCartItems(state: RootState) {
  return state.cart.cartItems;
}

export const selectCartCount = createSelector([selectCartItems], (items) =>
  items.reduce((totalCount, item) => totalCount + (item ? item.quantity : 0), 0)
);

export const selectDiscountTotal = createSelector([selectCartItems], (items) =>
  items.reduce(
    (discountTotal, item) =>
      discountTotal +
      (item?.product?.isOnSale === 'Yes'
        ? Math.round(item?.product?.price! * (item.product.salePercentage / 100)) * item.quantity
        : 0),
    0
  )
);

export const selectCartTotal = createSelector([selectCartItems], (items) =>
  items.reduce((totalPrice, item) => totalPrice + item?.product?.price! * item.quantity, 0)
);

export const selectDeliveryFee = createSelector([selectCartTotal, selectDiscountTotal], (cartTotal, discountTotal) =>
  cartTotal - discountTotal > 500 ? 0 : 60
);

export const selectOrderTotal = createSelector(
  [selectCartTotal, selectDiscountTotal],
  (cartTotal, discountTotal) => cartTotal - discountTotal
);
