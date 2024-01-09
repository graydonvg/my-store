import { CustomResponseType, UpdateOrderType } from '@/types';

export default async function updateOrder(orderData: UpdateOrderType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/orders/update/payment-status', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/update-order-payment-status. ${error}`);
  }
}
