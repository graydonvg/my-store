import Products from '@/components/Products';
import getProducts from '@/services/get-products';
import { Typography } from '@mui/material';

export default async function Home() {
  const products = await getProducts();

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
