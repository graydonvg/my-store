import Products from '@/components/Products';
import { Typography } from '@mui/material';

export default async function Home() {
  const response = await fetch('http://localhost:3000/api/products/get', {
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
