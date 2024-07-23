import { CONSTANTS } from '@/constants';
import { CustomResponse } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function deleteAddress(id: number): Promise<CustomResponse> {
  const logger = log.with({ context: 'service: deleteAddress' });

  logger.info('Attempting to delete address');

  try {
    const response = await fetch(`/api/secure/users/address/delete?address_id=${id}`, {
      method: 'DELETE',
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
