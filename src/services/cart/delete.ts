import { CONSTANTS } from '@/constants';
import { ResponseNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function deleteItemFromCart(cartItemId: number): Promise<ResponseNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'deleteItemFromCart' });

  serviceLog.info('Attempting to delete cart item by id');

  try {
    const response = await fetch(`/api/secure/cart/delete/by-id?cart_item_id=${cartItemId}`, {
      method: 'DELETE',
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
