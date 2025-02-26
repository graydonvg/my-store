import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function deleteItemFromCart(id: number): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: deleteItemFromCart' });

  logger.info('Attempting to delete cart item');

  try {
    const response = await fetch(`/api/secure/cart/delete?cart_item_id=${id}`, {
      method: 'DELETE',
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
