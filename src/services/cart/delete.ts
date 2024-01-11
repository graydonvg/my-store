import { CustomResponseType } from '@/types';

export async function deleteItemFromCart(cartItemId: string): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/cart/delete/by-id', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(cartItemId),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/cart/delete. ${error}`);
  }
}

export async function deleteAllCartItems(): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/cart/delete/all', {
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
