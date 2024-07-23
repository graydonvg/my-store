import { CONSTANTS } from '@/constants';
import { InsertOrder, AddOrderResponse, ResponseWithData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function addOrder(data: InsertOrder): Promise<ResponseWithData<AddOrderResponse | null>> {
  const logger = log.with({ context: 'service: addOrder' });

  log.info('Attempting to add order');

  try {
    const response = await fetch('/api/secure/orders/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED, data: null };
  } finally {
    await logger.flush();
  }
}
