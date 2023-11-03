import getURL from '@/lib/utils';
import { CustomResponseType } from '@/types';

export default async function getAllProducts(): Promise<CustomResponseType> {
  const url = getURL('/api/products/get-all');
  const response = await fetch(url, {
    cache: 'force-cache',
  });
  const data = await response.json();

  return data;
}
