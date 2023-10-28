import { CustomResponseType } from '@/types';

export default async function signUpNewUserWithPassword(formData: { email: string; password: string }) {
  const response = await fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const data: CustomResponseType = await response.json();

  return data;
}
