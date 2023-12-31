import { CustomResponseType } from '@/types';
import createURL from '@/utils/createURL';

export default async function signOut(): Promise<CustomResponseType> {
  const url = createURL('/api/auth/sign-out');

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
