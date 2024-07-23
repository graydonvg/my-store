import { CONSTANTS } from '@/constants';
import { ResponseWithNoData, UpdateOrderStatus } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function updateOrderStatus(data: UpdateOrderStatus): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: updateOrderStatus' });

  logger.info('Attempting to update order status');

  try {
    const response = await fetch('/api/secure/orders/update', {
      method: 'PUT',
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
