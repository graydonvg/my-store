import { CONSTANTS } from '@/constants';
import { CustomResponse, ResponseWithData, Product } from '@/types';

export async function getAllProducts(): Promise<ResponseWithData<Product[] | null>> {
  try {
    const url = `${CONSTANTS.URL}/api/products/get-all`;

    const response = await fetch(url, {
      method: 'GET',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/get-all. ${error}`);
  }
}

export async function getProductById(productId: string): Promise<CustomResponse<Product>> {
  try {
    const url = `${CONSTANTS.URL}/api/products/get-by-id?product_id=${productId}`;

    const response = await fetch(url, {
      method: 'GET',
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/get-by-id. ${error}`);
  }
}

export async function getProductsByCategory(category: string): Promise<CustomResponse<Product[]>> {
  try {
    const url = `${CONSTANTS.URL}/api/products/get-by-category?category=${category}`;

    const response = await fetch(url, {
      method: 'GET',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/get-by-category. ${error}`);
  }
}

export async function getProductsOnSale(): Promise<CustomResponse<Product[]>> {
  try {
    const url = `${CONSTANTS.URL}/api/products/get-on-sale`;

    const response = await fetch(url, {
      method: 'GET',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/products/get-on-sale. ${error}`);
  }
}
