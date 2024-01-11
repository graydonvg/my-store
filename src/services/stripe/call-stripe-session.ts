import { CustomResponseType, StripeResponseType } from '@/types';

export async function callStripeSession(lineItems: any): Promise<CustomResponseType<StripeResponseType>> {
  try {
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(lineItems),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/call-stripe-session. ${error}`);
  }
}
