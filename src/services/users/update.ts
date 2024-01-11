import { CustomResponseType, UpdateAddressTypeDb, userPasswordType, userPersonalInformationType } from '@/types';

export async function updateAddress(formData: UpdateAddressTypeDb): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/address/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/users/address/update. ${error}`);
  }
}

export async function updateUserPersonalInformation(
  formData: userPersonalInformationType
): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/personal/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/users/personal/update. ${error}`);
  }
}

export async function updateUserPassword(formData: userPasswordType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/password/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/users/password/update. ${error}`);
  }
}
