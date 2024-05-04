import { InsertCartItemDb, CustomResponse } from '@/types';

export default async function addItemToCart(cartItemData: InsertCartItemDb): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/cart/add', {
      method: 'POST',
      cache: 'no-store',
      body: JSON.stringify(cartItemData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    // throw new Error(`@services/cart/add. ${error}`);
    return { success: false, message: 'An unexpected error occured.' };
  }
}
