import { CONSTANTS } from '@/constants';
import { CustomResponse } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function deleteAddress(addressId: number): Promise<CustomResponse> {
  const serviceLog = log.with({ scope: 'service', function: 'deleteAddress' });

  serviceLog.info('Attempting to delete address');

  try {
    const response = await fetch(`/api/secure/users/address/delete?address_id=${addressId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await serviceLog.flush();
  }
}
