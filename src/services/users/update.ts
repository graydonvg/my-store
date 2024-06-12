import { CONSTANTS } from '@/constants';
import { ResponseWithNoData, UpdateAddressDb, UpdateUserData, userPasswordType } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function updateUserAddress(addressData: UpdateAddressDb): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateUserAddress' });

  serviceLog.info('Attempting to update address');

  try {
    const response = await fetch('/api/secure/users/address/update', {
      method: 'PUT',
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

export async function updateUserPersonalInformation(userData: UpdateUserData): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateUserPersonalInformation' });

  serviceLog.info('Attempting to update user personal information');

  try {
    const response = await fetch('/api/secure/users/personal/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
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

export async function updateUserPassword(passwordData: userPasswordType): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'updateUserPassword' });

  serviceLog.info('Attempting to update user password');

  try {
    const response = await fetch('/api/secure/users/password/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordData),
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
