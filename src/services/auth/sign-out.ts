import { CustomResponse } from '@/types';

export default async function signOut(): Promise<CustomResponse> {
  try {
    const response = await fetch('/api/secure/auth/sign-out', {
      method: 'GET',
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/auth/sign-out. ${error}`);
  }
}
