import { CustomResponseType, UserAuthType } from '@/types';

export default async function signInWithPassword(signInData: UserAuthType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(signInData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/auth/sign-in. ${error}`);
  }
}
