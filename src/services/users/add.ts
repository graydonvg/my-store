import { CONSTANTS } from '@/constants';
import { InsertAddressDb, ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function addNewAddress(addressData: InsertAddressDb): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'addNewAddress' });

  serviceLog.info('Attempting to add address');

  try {
    const response = await fetch('/api/secure/users/address/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData),
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
