import { CustomResponseType } from '@/types';

export default async function deleteAllCartItems(userId: string): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/cart/delete/all', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userId),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/delete-all-cart-items. ${error}`);
  }
}
