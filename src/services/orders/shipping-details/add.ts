import { CustomResponseType, InserOrderShippingDetailsType } from '@/types';

export default async function addOrderShippingDetails(
  orderShippingDetails: InserOrderShippingDetailsType
): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/orders/shipping-details/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(orderShippingDetails),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/add-order-shipping-details. ${error}`);
  }
}
