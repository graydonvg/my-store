import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { ResponseWithData, Product } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function getAllProducts(): Promise<ResponseWithData<Product[] | null>> {
  const logger = log.with({ context: 'service: getAllProducts' });

  logger.info('Attempting to fetch all products');

  try {
    const url = `${URL}/api/products/get-all`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected, data: null };
  } finally {
    await logger.flush();
  }
}

export async function getProductById(id: string): Promise<ResponseWithData<Product | null>> {
  const logger = log.with({ context: 'service: getProductById' });

  logger.info('Attempting to fetch product by id');

  try {
    const url = `${URL}/api/products/get-by-id?product_id=${id}`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected, data: null };
  } finally {
    await logger.flush();
  }
}

export async function getProductsByCategory(category: string): Promise<ResponseWithData<Product[] | null>> {
  const logger = log.with({ context: 'service: getProductsByCategory' });

  logger.info('Attempting to fetch products by category');

  try {
    const url = `${URL}/api/products/get-by-category?category=${category}`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected, data: null };
  } finally {
    await logger.flush();
  }
}

export async function getProductsOnSale(): Promise<ResponseWithData<Product[] | null>> {
  const logger = log.with({ context: 'service: getProductsOnSale' });

  logger.info('Attempting to fetch products on sale');

  try {
    const url = `${URL}/api/products/get-on-sale`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected, data: null };
  } finally {
    await logger.flush();
  }
}

export async function getLimitedProductsOnSale(): Promise<ResponseWithData<Product[] | null>> {
  const logger = log.with({ context: 'service: getLimitedProductsOnSale' });

  logger.info('Attempting to fetch limited products on sale');

  try {
    const url = `${URL}/api/products/get-limited-on-sale`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected, data: null };
  } finally {
    await logger.flush();
  }
}

export async function getLimitedLatestProducts(): Promise<ResponseWithData<Product[] | null>> {
  const logger = log.with({ context: 'service: getLimitedLatestProducts' });

  logger.info('Attempting to fetch limited latest products');

  try {
    const url = `${URL}/api/products/get-limited-latest`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected, data: null };
  } finally {
    await logger.flush();
  }
}
