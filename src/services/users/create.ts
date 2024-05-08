import { AdminAddNewUserResponse, CustomResponse, UpdateUserPersonalInformationDb, UserAuthData } from '@/types';

export async function createNewUser(
  userData: UserAuthData & UpdateUserPersonalInformationDb
): Promise<CustomResponse<AdminAddNewUserResponse>> {
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
    throw new Error(`@services/users/create. ${error}`);
  }
}
