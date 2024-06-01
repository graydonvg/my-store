import { CONSTANTS } from '@/constants';
import { ResponseWithNoData, UpdateUserDb, UserAuthData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function signUpNewUser(signUpData: UserAuthData & UpdateUserDb): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'signUpNewUser' });

  serviceLog.info('Attempting to sign up user');

  try {
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signUpData),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    serviceLog.error(CONSTANTS.LOGGER_ERROR_MESSAGES.GENERAL, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL };
  } finally {
    await serviceLog.flush();
  }
}
