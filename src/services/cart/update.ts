import { CONSTANTS } from '@/constants';
import { ResponseWithNoData, UpdateCartItemQuantity, UpdateCartItemSize } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function updateCartItemSize(data: UpdateCartItemSize): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateCartItemSize' });

  serviceLog.info('Attempting to update cart item size');

  try {
    const response = await fetch('/api/secure/cart/update/size', {
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

export async function updateCartItemQuantity(data: UpdateCartItemQuantity): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateCartItemQuantity' });

  serviceLog.info('Attempting to update cart item quantity');

  try {
    const response = await fetch('/api/secure/cart/update/quantity', {
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
