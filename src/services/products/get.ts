import { CONSTANTS } from '@/constants';
import { ResponseWithData, Product } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function getAllProducts(): Promise<ResponseWithData<Product[] | null>> {
  const serviceLog = log.with({ scope: 'service', function: 'getAllProducts' });

  serviceLog.info('Attempting to fetch all products');
  try {
    const url = `${CONSTANTS.URL}/api/products/get-all`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED, data: null };
  } finally {
    await serviceLog.flush();
  }
}

export async function getProductById(id: string): Promise<ResponseWithData<Product | null>> {
  const serviceLog = log.with({ scope: 'service', function: 'getProductById' });

  serviceLog.info('Attempting to fetch product by id');

  try {
    const url = `${CONSTANTS.URL}/api/products/get-by-id?product_id=${id}`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED, data: null };
  } finally {
    await serviceLog.flush();
  }
}

export async function getProductsByCategory(category: string): Promise<ResponseWithData<Product[] | null>> {
  const serviceLog = log.with({ scope: 'service', function: 'getProductsByCategory' });

  serviceLog.info('Attempting to fetch products by category');

  try {
    const url = `${CONSTANTS.URL}/api/products/get-by-category?category=${category}`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED, data: null };
  } finally {
    await serviceLog.flush();
  }
}

export async function getProductsOnSale(): Promise<ResponseWithData<Product[] | null>> {
  const serviceLog = log.with({ scope: 'service', function: 'getProductsOnSale' });

  serviceLog.info('Attempting to fetch products on sale');

  try {
    const url = `${CONSTANTS.URL}/api/products/get-on-sale`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED, data: null };
  } finally {
    await serviceLog.flush();
  }
}
