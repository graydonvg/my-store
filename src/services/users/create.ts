import { CreateUserResponseType, CustomResponseType, UpdateUserPersonalInformationType, UserAuthType } from '@/types';

export async function createAuthUser(
  userData: UserAuthType & UpdateUserPersonalInformationType
): Promise<CustomResponseType<CreateUserResponseType>> {
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
