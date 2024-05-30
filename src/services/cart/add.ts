import { CONSTANTS } from '@/constants';
import { InsertCartItemDb, ResponseNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function addItemToCart(cartItemData: InsertCartItemDb): Promise<ResponseNoData[]> {
  const serviceLog = log.with({ scope: 'service', function: 'addItemToCart' });

  serviceLog.info('Attempting to add item to cart');

  try {
    const response = await fetch('/api/secure/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItemData),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.GENERAL_ERROR, { error });

    return [{ success: false, message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL_ERROR }];
  } finally {
    await serviceLog.flush();
  }
}
