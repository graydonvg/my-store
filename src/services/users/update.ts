import { CONSTANTS } from '@/constants';
import { ResponseWithNoData, UpdateAddress, UpdateUserData, UpdatePassword } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function updateUserAddress(data: UpdateAddress): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateUserAddress' });

  serviceLog.info('Attempting to update address');

  try {
    const response = await fetch('/api/secure/users/address/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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

export async function updateUserPersonalInformation(data: UpdateUserData): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateUserPersonalInformation' });

  serviceLog.info('Attempting to update user personal information');

  try {
    const response = await fetch('/api/secure/users/personal/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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

export async function updateUserPassword(data: UpdatePassword): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateUserPassword' });

  serviceLog.info('Attempting to update user password');

  try {
    const response = await fetch('/api/secure/users/password/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
