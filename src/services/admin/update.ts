import { CONSTANTS } from '@/constants';
import { ResponseWithNoData, UpdateOrder, UpdateProduct, UpdateUserAdmin } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function updateProduct(data: UpdateProduct): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateProduct' });

  serviceLog.info('Attempting to update product');

  try {
    const response = await fetch('/api/secure/admin/products/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await serviceLog.flush();
  }
}

export async function updateUser(data: UpdateUserAdmin): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateUser' });

  serviceLog.info('Attempting to update user');

  try {
    const response = await fetch('/api/secure/admin/users/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await serviceLog.flush();
  }
}

export async function updateOrder(data: UpdateOrder): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateOrder' });

  serviceLog.info('Attempting to update order');

  try {
    const response = await fetch('/api/secure/admin/orders/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await serviceLog.flush();
  }
}
