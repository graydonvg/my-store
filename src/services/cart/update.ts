import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { ResponseWithNoData, UpdateCartItemQuantity, UpdateCartItemSize } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function updateCartItemSize(data: UpdateCartItemSize): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: updateCartItemSize' });

  logger.info('Attempting to update cart item size');

  try {
    const response = await fetch('/api/secure/cart/update/size', {
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

export async function updateCartItemQuantity(data: UpdateCartItemQuantity): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: updateCartItemQuantity' });

  logger.info('Attempting to update cart item quantity');

  try {
    const response = await fetch('/api/secure/cart/update/quantity', {
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
