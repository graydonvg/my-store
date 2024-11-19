import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { ResponseWithNoData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function signOut(): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: signOut' });

  logger.info('Attempting to sign out user');

  try {
    const response = await fetch('/api/secure/auth/sign-out', {
      method: 'GET',
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
