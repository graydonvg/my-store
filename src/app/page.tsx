import Products from '@/components/Products';
import getAllProducts from '@/services/get-all-products';
import { ProductType } from '@/types';
import { Typography } from '@mui/material';

export default async function Home() {
  // const { data: products } = await getAllProducts();
  const res = await fetch('https://my-store-henna.vercel.app/api/products/get-all', {
    method: 'GET',
  });
  const { data: products } = await res.json();

  // console.log(products);

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
