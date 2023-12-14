import { CustomResponseType, UpdateAddressTypeDb } from '@/types';

export async function updateAddress(formData: UpdateAddressTypeDb): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/update/address', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/update-address. ${error}`);
  }
}
