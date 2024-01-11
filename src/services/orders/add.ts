import { AddOrderType, AddOrderResponseType, CustomResponseType } from '@/types';

export default async function addOrder(orderData: AddOrderType): Promise<CustomResponseType<AddOrderResponseType>> {
  try {
    const response = await fetch('/api/secure/orders/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/orders/add. ${error}`);
  }
}
