import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function deleteItemFromWishlist(id: number): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: deleteItemFromWishlist' });

  logger.info('Attempting to delete wishlist item');

  try {
    const response = await fetch(`/api/secure/wishlist/delete?wishlist_item_id=${id}`, {
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
