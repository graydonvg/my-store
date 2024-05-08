import { CustomResponse } from '@/types';
import { GridRowSelectionModel } from '@mui/x-data-grid';

export async function deleteAddress(addressId: string): Promise<CustomResponse> {
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

export async function deleteAuthUser(userIds: GridRowSelectionModel): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/admin/users/delete', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userIds),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/users/create. ${error}`);
  }
}
