import getURL from '@/lib/utils';
import { CustomResponseType } from '@/types';

export default async function signOut(): Promise<CustomResponseType> {
  const url = getURL('/api/auth/sign-out');

  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/sign-out. ${error}`);
  }
}
