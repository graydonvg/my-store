import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
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
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected, data: null };
  } finally {
    await logger.flush();
  }
}
