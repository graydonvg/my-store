import { CustomResponseType, ProductType } from '@/types';
import createURL from '@/utils/createURL';

export async function getAllProducts(): Promise<CustomResponseType<ProductType[]>> {
  try {
    const response = await fetch('/api/products/get-all', {
      method: 'GET',
      cache: 'force-cache',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/get-all-products. ${error}`);
  }
}

export async function getProductById(productId: string): Promise<CustomResponseType<ProductType>> {
  try {
    const response = await fetch(`/api/products/get-by-id?product_id=${productId}`, {
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
  try {
    const response = await fetch(`/api/products/get-by-category?category=${category}`, {
      method: 'GET',
      cache: 'force-cache',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/get-products-by-category. ${error}`);
  }
}
