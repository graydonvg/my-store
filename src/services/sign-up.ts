import { ResponseType } from '@/types';

export default async function signUpNewUserWithPassword(formData: { email: string; password: string }) {
  try {
    const response = await fetch('/api/auth/sign-up', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data: ResponseType = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}
