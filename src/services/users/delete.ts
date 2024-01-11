import { CustomResponseType } from '@/types';

export async function deleteAddress(addressId: string): Promise<CustomResponseType> {
  try {
    const response = await fetch(`/api/users/address/delete?address_id=${addressId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(addressId),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/users/address/delete. ${error}`);
  }
}
