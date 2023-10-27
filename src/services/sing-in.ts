import { ResponseType } from '@/types';

export default async function signInUserWithPassword(formData: { email: string; password: string }) {
  try {
    const response = await fetch('/api/auth/sign-in', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data: Omit<ResponseType, 'userId'> = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
}
