import { RootState } from '../../store';

export function selectWishlistData(state: RootState) {
  return state.wishlist.wishlistData;
}
