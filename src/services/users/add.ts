import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { InsertAddress, ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function addNewAddress(data: InsertAddress): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: addNewAddress' });

  logger.info('Attempting to add address');

  try {
    const response = await fetch('/api/secure/users/address/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected };
  } finally {
    await logger.flush();
  }
}
