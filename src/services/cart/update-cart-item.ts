import { CustomResponseType, UpdateCartItemDbType } from '@/types';

export default async function updateCartItem(cartItemData: UpdateCartItemDbType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/cart/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(cartItemData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/update-cart-item. ${error}`);
  }
}
