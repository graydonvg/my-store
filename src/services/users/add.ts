import { CustomResponseType, InsertAddressType } from '@/types';

export async function addNewAddress(addressData: InsertAddressType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/secure/users/address/add', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/users/address/add. ${error}`);
  }
}
