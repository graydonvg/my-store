import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { ResponseWithNoData, UpdateAddress, UserPersonalInfo, UpdatePassword } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function updateUserAddress(data: UpdateAddress): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: updateUserAddress' });

  logger.info('Attempting to update address');

  try {
    const response = await fetch('/api/secure/users/address/update', {
      method: 'PUT',
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

export async function updateUserPersonalInformation(data: UserPersonalInfo): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: updateUserPersonalInformation' });

  logger.info('Attempting to update user personal information');

  try {
    const response = await fetch('/api/secure/users/personal/update', {
      method: 'PUT',
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

export async function updateUserPassword(data: UpdatePassword): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: updateUserPassword' });

  logger.info('Attempting to update user password');

  try {
    const response = await fetch('/api/secure/users/password/update', {
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
