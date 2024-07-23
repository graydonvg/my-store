import { CONSTANTS } from '@/constants';
import { InsertCartItem, ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function addItemToCart(data: InsertCartItem): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: addItemToCart' });

  logger.info('Attempting to add item to cart');

  try {
    const response = await fetch('/api/secure/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await logger.flush();
  }
}
