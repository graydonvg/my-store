import { InsertOrderDb, AddOrderResponse, CustomResponse } from '@/types';

export default async function addOrder(orderData: InsertOrderDb): Promise<CustomResponse<AddOrderResponse>> {
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
