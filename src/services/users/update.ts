import { CustomResponseType, UpdateAddressTypeDb, userPasswordType, userPersonalInformationType } from '@/types';

export async function updateAddress(formData: UpdateAddressTypeDb): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/update/address', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/users/update/address. ${error}`);
  }
}

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
    throw new Error(`@services/users/update/personal. ${error}`);
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
    throw new Error(`@services/users/update/password. ${error}`);
  }
}
