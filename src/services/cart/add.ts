import { CONSTANTS } from '@/constants';
import { InsertCartItemDb, CustomResponse } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function addItemToCart(cartItemData: InsertCartItemDb): Promise<CustomResponse> {
  const serviceLog = log.with({ scope: 'service', function: 'addItemToCart' });

  serviceLog.info('Attempting to add item to cart');

  try {
    const response = await fetch('/api/secure/cart/add', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItemData),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.ERROR_MESSAGES.GENERAL_ERROR, { error });

    return { success: false, message: CONSTANTS.ERROR_MESSAGES.GENERAL_ERROR };
  } finally {
    await serviceLog.flush();
  }
}
