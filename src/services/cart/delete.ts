import { CustomResponse } from '@/types';

export async function deleteItemFromCart(cartItemId: number): Promise<CustomResponse> {
  try {
    const response = await fetch(`/api/secure/cart/delete/by-id?cart_item_id=${cartItemId}`, {
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

export async function deleteAllCartItems(): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/cart/delete/all', {
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
