import { CustomResponse, StripeLineItem, StripeCheckoutSessionResponse } from '@/types';

export async function callStripeSession(
  lineItems: StripeLineItem[]
): Promise<CustomResponse<StripeCheckoutSessionResponse>> {
  try {
    const response = await fetch('/api/secure/stripe', {
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
