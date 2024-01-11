import { CustomResponseType, UpdateAddressTypeDb, userPasswordType, userPersonalInformationType } from '@/types';

export async function updateAddress(addressData: UpdateAddressTypeDb): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/address/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/users/address/update. ${error}`);
  }
}

export async function updateUserPersonalInformation(
  personalData: userPersonalInformationType
): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/personal/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(personalData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/users/personal/update. ${error}`);
  }
}

export async function updateUserPassword(passwordData: userPasswordType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/users/password/update', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/users/password/update. ${error}`);
  }
}
