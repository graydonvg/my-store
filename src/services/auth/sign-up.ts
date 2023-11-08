import getURL from '@/lib/utils';
import { CustomResponseType } from '@/types';

export default async function signUpNewUser(formData: {
  email: string;
  password: string;
}): Promise<CustomResponseType> {
  const url = getURL('/api/auth/sign-up');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/sign-up. ${error}`);
  }
}
