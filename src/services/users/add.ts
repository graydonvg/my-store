import { CustomResponse, InsertAddressDb } from '@/types';

export async function addNewAddress(addressData: InsertAddressDb): Promise<CustomResponse> {
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
    throw new Error(`@services/users/add. ${error}`);
  }
}
