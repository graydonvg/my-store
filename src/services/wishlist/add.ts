import { CONSTANTS } from '@/constants';
import { InsertWishlistItemDb, ResponseNoData } from '@/types';

import { Logger } from 'next-axiom';

const log = new Logger();

export default async function addItemToWishlist(wishlistItemData: InsertWishlistItemDb): Promise<ResponseNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'addItemToWishlist' });

  serviceLog.info('Attempting to add item to wishlist');

  try {
    const response = await fetch('/api/secure/wishlist/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wishlistItemData),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.GENERAL_ERROR, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL_ERROR };
  } finally {
    await serviceLog.flush();
  }
}
