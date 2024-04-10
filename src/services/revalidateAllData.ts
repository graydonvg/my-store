import { CustomResponseType } from '@/types';
import createURL from '@/utils/createURL';

export default async function revalidateAllData(): Promise<CustomResponseType> {
  const url = createURL('/api/secure/revalidate');

  try {
    const response = await fetch(`${url}?secret=${process.env.NEXT_PUBLIC_ON_DEMAND_REVALIDATION_SECRET_TOKEN}`);

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/revalidate. ${error}`);
  }
}
