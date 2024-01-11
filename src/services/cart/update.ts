import { CustomResponseType, UpdateCartItemQuantityType, UpdateCartItemSizeType } from '@/types';

export async function updateCartItemSize(cartItemData: UpdateCartItemSizeType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/cart/update/size', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(cartItemData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/cart/update. ${error}`);
  }
}

export async function updateCartItemQuantity(cartItemData: UpdateCartItemQuantityType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/cart/update/quantity', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(cartItemData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/cart/update. ${error}`);
  }
}
