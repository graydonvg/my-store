import { constants } from '@/constants';
import { CustomResponse, CustomResponseWithData, Product } from '@/types';

export async function getAllProducts(): Promise<CustomResponseWithData<Product[] | null>> {
  try {
    const url = `${constants.url}/api/products/get-all`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/get-all. ${error}`);
  }
}

export async function getProductById(productId: string): Promise<CustomResponse<Product>> {
  try {
    const url = `${constants.url}/api/products/get-by-id?product_id=${productId}`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/get-by-id. ${error}`);
  }
}

export async function getProductsByCategory(category: string): Promise<CustomResponse<Product[]>> {
  try {
    const url = `${constants.url}/api/products/get-by-category?category=${category}`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/get-by-category. ${error}`);
  }
}

export async function getProductsOnSale(): Promise<CustomResponse<Product[]>> {
  try {
    const url = `${constants.url}/api/products/get-on-sale`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/get-on-sale. ${error}`);
  }
}
