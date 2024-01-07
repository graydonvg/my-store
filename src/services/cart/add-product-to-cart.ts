import { InsertCartItemType, CustomResponseType } from '@/types';

export default async function addProductToCart(cartItem: InsertCartItemType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      cache: 'no-store',
      body: JSON.stringify(cartItem),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/add-product-to-cart. ${error}`);
  }
}
