import { CONSTANTS } from '@/constants';
import { ResponseWithNoData, UserAuthData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function signInWithPassword(data: UserAuthData): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: signInWithPassword' });

  logger.info('Attempting to sign in user');

  try {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
