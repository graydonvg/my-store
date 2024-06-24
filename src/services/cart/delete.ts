import { CONSTANTS } from '@/constants';
import { ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function deleteItemFromCart(id: number): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'deleteItemFromCart' });

  serviceLog.info('Attempting to delete cart item');

  try {
    const response = await fetch(`/api/secure/cart/delete?cart_item_id=${id}`, {
      method: 'DELETE',
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
