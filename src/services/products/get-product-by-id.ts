import getURL from '@/lib/utils';
import { CustomResponseType, ProductType } from '@/types';

export default async function getProductById(product_id: string): Promise<CustomResponseType<ProductType>> {
  const url = getURL(`/api/products/get-by-id?product_id=${product_id}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/get-product-by-id. ${error}`);
  }
}
