import { CONSTANTS } from '@/constants';
import { ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function signOut(): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'signOut' });

  serviceLog.info('Attempting to sign out user');
  try {
    const response = await fetch('/api/secure/auth/sign-out', {
      method: 'GET',
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
