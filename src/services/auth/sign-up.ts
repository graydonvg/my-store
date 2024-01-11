import { CustomResponseType, UserAuthType } from '@/types';

export default async function signUpNewUser(signUpData: UserAuthType): Promise<CustomResponseType> {
  try {
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(signUpData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/auth/sign-up. ${error}`);
  }
}
