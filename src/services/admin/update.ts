import { CONSTANTS } from '@/constants';
import { ResponseWithNoData, UpdateOrderAdminDb, UpdateProduct, UpdateUserAdminDb } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function updateProduct(productData: UpdateProduct): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateProduct' });

  serviceLog.info('Attempting to update product');

  try {
    const response = await fetch('/api/secure/admin/products/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.GENERAL, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL };
  } finally {
    await serviceLog.flush();
  }
}

export async function updateUser(userData: UpdateUserAdminDb): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateUser' });

  serviceLog.info('Attempting to update user');

  try {
    const response = await fetch('/api/secure/admin/users/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.GENERAL, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL };
  } finally {
    await serviceLog.flush();
  }
}

export async function updateOrder(orderData: UpdateOrderAdminDb): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateOrder' });

  serviceLog.info('Attempting to update order');

  try {
    const response = await fetch('/api/secure/admin/orders/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.GENERAL, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL };
  } finally {
    await serviceLog.flush();
  }
}
