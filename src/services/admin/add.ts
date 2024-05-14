import { AddNewUserAdminResponse, CreateUserAdminDb, CustomResponse, UserAuthData } from '@/types';

export async function createNewUserAdmin(
  userData: UserAuthData & CreateUserAdminDb
): Promise<CustomResponse<AddNewUserAdminResponse>> {
  try {
    const response = await fetch('/api/secure/admin/users/create', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/admin/add. ${error}`);
  }
}
