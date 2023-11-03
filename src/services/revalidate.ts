import getURL from '@/lib/utils';

export default async function revalidate(path: string) {
  const url = getURL(path);
  const response = await fetch(`${url}?path=/&secret=${process.env.NEXT_PUBLIC_ON_DEMAND_REVALIDATION_SECRET_TOKEN}`);

  const data = await response.json();

  return data;
}