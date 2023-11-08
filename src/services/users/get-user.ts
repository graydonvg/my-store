import getURL from '@/lib/utils';
import { CurrentUserType, CustomResponseType } from '@/types';

export default async function getUser(): Promise<CustomResponseType<CurrentUserType>> {
  const url = getURL('/api/users/get');

  try {
    const response = await fetch(url, {
      cache: 'no-store',
    });
    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/get-user. ${error}`);
  }
}
