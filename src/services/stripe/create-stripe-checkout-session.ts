import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import { ResponseWithData, StripeCheckoutData, StripeCheckoutSessionResponse } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function createStripeCheckoutSession(
  data: StripeCheckoutData
): Promise<ResponseWithData<StripeCheckoutSessionResponse | null>> {
  const logger = log.with({ context: 'service: createStripeCheckoutSession' });

  logger.info('Attempting to create Stripe checkout session');

  try {
    const response = await fetch('/api/secure/stripe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return { success: false, message: USER_ERROR_MESSAGES.unexpected, data: null };
  } finally {
    await logger.flush();
  }
}
