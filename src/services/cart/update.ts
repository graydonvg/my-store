import { CustomResponse, UpdateCartItemQuantity, UpdateCartItemSize } from '@/types';

export async function updateCartItemSize(cartItemData: UpdateCartItemSize): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/cart/update/size', {
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

export async function updateCartItemQuantity(cartItemData: UpdateCartItemQuantity): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/cart/update/quantity', {
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
