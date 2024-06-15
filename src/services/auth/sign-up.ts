import { CONSTANTS } from '@/constants';
import { ResponseWithNoData, UpdateUserData, UserAuthData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function signUpNewUser(data: UserAuthData & UpdateUserData): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'signUpNewUser' });

  serviceLog.info('Attempting to sign up user');

  try {
    const response = await fetch('/api/auth/sign-up', {
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
