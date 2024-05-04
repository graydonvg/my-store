import { CustomResponse, InsertWishlistItemDb } from '@/types';

export default async function addItemToWishlist(wishlistItemData: InsertWishlistItemDb): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/wishlist/add', {
      method: 'POST',
      cache: 'no-store',
      body: JSON.stringify(wishlistItemData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return { success: false, message: 'An unexpected error occured.' };
  }
}
