import { CustomResponseType } from '@/types';

export default async function deleteOrder(orderId: string): Promise<CustomResponseType> {
  try {
    const response = await fetch(`/api/orders/delete?order_id=${orderId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/orders/delete. ${error}`);
  }
}
