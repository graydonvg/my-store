import Products from '@/components/Products';
import getProductsByCategory from '@/services/get-products-by-category';
import { ProductType } from '@/types';
import { Typography } from '@mui/material';

export default async function AllProductsForMen() {
  const { data: products } = await getProductsByCategory('Men');

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', padding: 2 }}>
        Men
      </Typography>
      <Products products={products ?? ([] as ProductType[])} />
    </>
  );
}
