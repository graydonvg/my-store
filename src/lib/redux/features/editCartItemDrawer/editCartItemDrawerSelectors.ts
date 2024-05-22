import { RootState } from '../../store';

export function selectCartItemToEditId(state: RootState) {
  return state.editCartItemDrawer.cartItemToEditId;
}

export function selectIsMovingToWishlist(state: RootState) {
  return state.editCartItemDrawer.isMovingToWishlist;
}

export function selectIsRemovingCartItem(state: RootState) {
  return state.editCartItemDrawer.isRemovingCartItem;
}

export function selectCartItemQuantityWillUpdate(state: RootState) {
  return state.editCartItemDrawer.cartItemQuantityWillUpdate;
}

export function selectIsUpdatingCartItemQuantity(state: RootState) {
  return state.editCartItemDrawer.isUpdatingCartItemQuantity;
}

export function selectIsUpdatingCartItemSize(state: RootState) {
  return state.editCartItemDrawer.isUpdatingCartItemSize;
}
