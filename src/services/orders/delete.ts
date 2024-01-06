import { CustomResponseType, DeleteOrderType } from '@/types';

export default async function deleteOrder(orderData: DeleteOrderType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/orders/delete', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/delete-order. ${error}`);
  }
}
