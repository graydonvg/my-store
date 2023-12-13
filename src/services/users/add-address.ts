import { CustomResponseType, InsertAddressType } from '@/types';

export async function addNewAddress(formData: InsertAddressType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/add/address', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/add-address. ${error}`);
  }
}
