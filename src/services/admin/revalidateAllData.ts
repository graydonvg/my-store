import { CustomResponse } from '@/types';

export default async function revalidateAllData(): Promise<CustomResponse> {
  try {
    const response = await fetch(
      `/api/secure/admin/revalidate?secret=${process.env.NEXT_PUBLIC_ON_DEMAND_REVALIDATION_SECRET_TOKEN}`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/revalidate. ${error}`);
  }
}
