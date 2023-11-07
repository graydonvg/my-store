import Products from '@/components/Products';
import getProductsByCategory from '@/services/get-products-by-category';
import { ProductType } from '@/types';
import { Typography } from '@mui/material';

export default async function AllProductsForWomen() {
  const { data: products } = await getProductsByCategory('Women');

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', padding: 2 }}>
        Women
      </Typography>
      <Products products={products ?? ([] as ProductType[])} />
    </>
  );
}
