import { CONSTANTS } from '@/constants';
import { CustomResponse, StripeCheckoutData, StripeCheckoutSessionResponse } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function createStripeCheckoutSession(
  data: StripeCheckoutData
): Promise<CustomResponse<StripeCheckoutSessionResponse>> {
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
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return { success: false, message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED };
  } finally {
    await logger.flush();
  }
}
