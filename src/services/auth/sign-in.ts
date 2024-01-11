import { CustomResponseType, UserAuthType } from '@/types';

export default async function signInWithPassword(formData: UserAuthType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/sign-in. ${error}`);
  }
}
