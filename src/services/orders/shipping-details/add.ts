import { CustomResponseType, InsertShippingDetailsType } from '@/types';

export default async function addOrderShippingDetails(
  formData: InsertShippingDetailsType
): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/orders/shipping-details/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/add-order-shipping-details. ${error}`);
  }
}
