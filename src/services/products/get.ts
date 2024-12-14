import { LOGGER_ERROR_MESSAGES, SITE_URL, USER_ERROR_MESSAGES } from '@/constants';
import { ResponseWithData, Product } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function getAllProductsCached(): Promise<ResponseWithData<Product[] | null>> {
  const logger = log.with({ context: 'service: getAllProductsCached' });

  logger.info('Attempting to fetch all products');

  try {
    const url = `${SITE_URL}/api/products/get-all`;

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

export async function getProductByIdCached(id: string): Promise<ResponseWithData<Product | null>> {
  const logger = log.with({ context: 'service: getProductByIdCached' });

  logger.info('Attempting to fetch product by id');

  try {
    const url = `${SITE_URL}/api/products/get-by-id?product_id=${id}`;

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

export async function getProductsByCategoryCached(category: string): Promise<ResponseWithData<Product[] | null>> {
  const logger = log.with({ context: 'service: getProductsByCategoryCached' });

  logger.info('Attempting to fetch products by category');

  try {
    const url = `${SITE_URL}/api/products/get-by-category?category=${category}`;

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

export async function getProductsOnSaleCached(): Promise<ResponseWithData<Product[] | null>> {
  const logger = log.with({ context: 'service: getProductsOnSaleCached' });

  logger.info('Attempting to fetch products on sale');

  try {
    const url = `${SITE_URL}/api/products/get-on-sale`;

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

export async function getHomePageProductsCached(): Promise<
  ResponseWithData<{ limitedLatestProducts: Product[] | null; limitedOnSaleProducts: Product[] | null } | null>
> {
  const logger = log.with({ context: 'service: getHomePageProductsCached' });

  logger.info('Attempting to fetch home page products');

  try {
    const url = `${SITE_URL}/api/products/get-home-page`;

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
