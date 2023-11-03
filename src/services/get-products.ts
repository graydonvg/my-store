import getURL from '@/lib/utils';

export default async function getAllProducts() {
  const url = getURL('/api/products/get-all');
  const response = await fetch(url, {
    cache: 'force-cache',
  });
  const products = await response.json();

  return products;
}
