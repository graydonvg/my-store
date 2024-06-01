import { CONSTANTS } from '@/constants';
import { ResponseWithNoData, UserAuthData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function signInWithPassword(signInData: UserAuthData): Promise<ResponseWithNoData> {
  const serviceLog = log.with({ scope: 'service', function: 'addItemToCart' });

  serviceLog.info('Attempting to add item to cart');

  try {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signInData),
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
