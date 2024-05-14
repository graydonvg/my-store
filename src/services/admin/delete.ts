import { CustomResponse } from '@/types';
import { GridRowSelectionModel } from '@mui/x-data-grid';

export async function deleteUserAdmin(userIds: GridRowSelectionModel): Promise<CustomResponse> {
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
    throw new Error(`@services/admin/delete. ${error}`);
  }
}
