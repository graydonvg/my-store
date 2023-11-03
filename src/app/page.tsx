import Products from '@/components/Products';
import getAllProducts from '@/services/get-products';
import { ProductType } from '@/types';
import { Typography } from '@mui/material';

export default async function Home() {
  const { data: products } = await getAllProducts();

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', padding: 4 }}>
        My E-commerce Website
      </Typography>
      <Products products={products ?? ([] as ProductType[])} />
    </>
  );
}
