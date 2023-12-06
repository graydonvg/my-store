import { CustomResponseType, userPasswordType, userPersonalInformationType } from '@/types';

export async function updateUserPersonalInformation(
  formData: userPersonalInformationType
): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/update/personal', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/update-user. ${error}`);
  }
}

export async function updateUserPassword(formData: userPasswordType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/update/password', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/update-user. ${error}`);
  }
}
