import { CustomResponse } from '@/types';

export async function deleteAddress(addressId: number): Promise<CustomResponse> {
  try {
    const response = await fetch(`/api/secure/users/address/delete?address_id=${addressId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(addressId),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/users/delete. ${error}`);
  }
}
