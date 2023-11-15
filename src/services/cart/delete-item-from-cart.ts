import { CustomResponseType } from '@/types';

export default async function deleteProductFromCart(cartItemId: string): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/cart/delete', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(cartItemId),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/delete-item-from-cart. ${error}`);
  }
}
