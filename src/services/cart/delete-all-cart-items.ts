import { CustomResponseType } from '@/types';

export default async function deleteAllCartItems(): Promise<CustomResponseType> {
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
    throw new Error(`@services/delete-all-cart-items. ${error}`);
  }
}
