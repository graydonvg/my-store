import { CONSTANTS } from '@/constants';
import { ResponseNoData, UpdateOrderStatus } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function updateOrderStatus(orderData: UpdateOrderStatus): Promise<ResponseNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateOrderStatus' });

  serviceLog.info('Attempting to update order status');

  try {
    const response = await fetch('/api/secure/orders/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
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
