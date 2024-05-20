import { CustomResponse, UpdateOrderStatus } from '@/types';

export default async function updateOrderStatus(orderData: UpdateOrderStatus): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/orders/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/orders/update. ${error}`);
  }
}
