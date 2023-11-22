import createURL from '@/lib/utils';
import { CustomResponseType, ProductType } from '@/types';

export default async function getProductsByCategory(category: string): Promise<CustomResponseType<ProductType[]>> {
  const url = createURL(`/api/products/get-by-category?category=${category}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/get-products-by-category. ${error}`);
  }
}
