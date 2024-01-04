import { CustomResponseType, InserOrderItemsType } from '@/types';

export default async function addOrderItems(orderItems: InserOrderItemsType[]): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/orders/items/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(orderItems),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/add-order-items. ${error}`);
  }
}
