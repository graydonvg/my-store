import { CONSTANTS } from '@/constants';
import { InsertOrderDb, AddOrderResponse, ResponseWithData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function addOrder(orderData: InsertOrderDb): Promise<ResponseWithData<AddOrderResponse | null>> {
  const serviceLog = log.with({ scope: 'service', function: 'addOrder' });

  log.info('Attempting to add order');

  try {
    const response = await fetch('/api/secure/orders/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.GENERAL_ERROR, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL_ERROR, data: null };
  } finally {
    await serviceLog.flush();
  }
}
