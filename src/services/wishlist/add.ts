import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { InsertWishlistItemDb, ResponseWithNoData } from '@/types';

import { Logger } from 'next-axiom';

const log = new Logger();

export default async function addItemToWishlist(data: InsertWishlistItemDb): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: addItemToWishlist' });

  logger.info('Attempting to add item to wishlist');

  try {
    const response = await fetch('/api/secure/wishlist/add', {
      method: 'POST',
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
