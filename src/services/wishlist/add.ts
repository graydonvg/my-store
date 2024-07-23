import { CONSTANTS } from '@/constants';
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
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await logger.flush();
  }
}
