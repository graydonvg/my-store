import createURL from '@/lib/utils';
import { InsertCartItemType, CustomResponseType } from '@/types';

export default async function addProductToCart(cartItem: InsertCartItemType): Promise<CustomResponseType> {
  const url = createURL('/api/cart/add');

  try {
    const response = await fetch(url, {
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
