import { CustomResponse } from '@/types';

export async function deleteItemFromWishlist(wishlistItemId: string): Promise<CustomResponse> {
  try {
    const response = await fetch(`/api/secure/wishlist/delete?wishlist_item_id=${wishlistItemId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/cart/delete. ${error}`);
  }
}
