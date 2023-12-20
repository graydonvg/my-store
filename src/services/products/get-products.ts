import createURL from '@/lib/utils';
import { CustomResponseType, ProductType } from '@/types';

export async function getAllProducts(): Promise<CustomResponseType<ProductType[]>> {
  const url = createURL('/api/products/get-all');

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/get-all-products. ${error}`);
  }
}

export async function getProductById(product_id: string): Promise<CustomResponseType<ProductType>> {
  const url = createURL(`/api/products/get-by-id?product_id=${product_id}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/get-product-by-id. ${error}`);
  }
}

export async function getProductsByCategory(category: string): Promise<CustomResponseType<ProductType[]>> {
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
