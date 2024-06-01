import { CONSTANTS } from '@/constants';
import { ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function deleteItemFromWishlist(wishlistItemId: number): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'deleteItemFromWishlist' });

  serviceLog.info('Attempting to delete wishlist item');

  try {
    const response = await fetch(`/api/secure/wishlist/delete?wishlist_item_id=${wishlistItemId}`, {
      method: 'DELETE',
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
