import Products from '@/components/Products';
import getURL from '@/lib/utils';
import { Typography } from '@mui/material';

export default async function Home() {
  const url = getURL('/api/products/get');
  const response = await fetch(url, {
    cache: 'force-cache',
  });

  const products = await response.json();

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', padding: 4 }}>
        My E-commerce Website
      </Typography>
      <Products products={products ?? []} />
    </>
  );
}
