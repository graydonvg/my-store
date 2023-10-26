import { Database } from '@/lib/database.types';
import { SignUpFormDataType } from '@/types';

export default async function signUpNewUser(formData: SignUpFormDataType) {
  try {
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    return response;
  } catch (error) {
    throw error;
  }
}
