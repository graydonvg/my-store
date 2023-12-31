import createURL from '@/utils/createURL';

export default async function revalidate(path: string) {
  const url = createURL('/api/revalidate');

  try {
    const response = await fetch(
      `${url}?path=${path}&secret=${process.env.NEXT_PUBLIC_ON_DEMAND_REVALIDATION_SECRET_TOKEN}`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`@services/revalidate. ${error}`);
  }
}
