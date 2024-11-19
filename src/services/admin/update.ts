import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { ResponseWithNoData, UpdateOrder, UpdateProduct, UpdateUserAdmin } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function updateProduct(data: UpdateProduct): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: updateProduct' });

  logger.info('Attempting to update product');

  try {
    const response = await fetch('/api/secure/admin/products/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected };
  } finally {
    await logger.flush();
  }
}

export async function updateUser(data: UpdateUserAdmin): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: updateUser' });

  logger.info('Attempting to update user');

  try {
    const response = await fetch('/api/secure/admin/users/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected };
  } finally {
    await logger.flush();
  }
}

export async function updateOrder(data: UpdateOrder): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: updateOrder' });

  logger.info('Attempting to update order');

  try {
    const response = await fetch('/api/secure/admin/orders/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected };
  } finally {
    await logger.flush();
  }
}
