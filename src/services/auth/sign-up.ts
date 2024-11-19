import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { ResponseWithNoData, UserPersonalInfo, UserAuthData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function signUpNewUser(data: UserAuthData & UserPersonalInfo): Promise<ResponseWithNoData> {
  const logger = log.with({ context: 'service: signUpNewUser' });

  logger.info('Attempting to sign up user');

  try {
    const response = await fetch('/api/auth/sign-up', {
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
