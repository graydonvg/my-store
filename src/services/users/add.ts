import { CONSTANTS } from '@/constants';
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
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await logger.flush();
  }
}
