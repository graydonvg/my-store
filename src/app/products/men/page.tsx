import Products from '@/components/Products';
import { getProductsByCategory } from '@/services/products/get-products';
import { ProductType } from '@/types';
import { Typography } from '@mui/material';

export default async function MenAllProducts() {
  const { data: products } = await getProductsByCategory('Men');

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', paddingBottom: 2 }}>
        Men
      </Typography>
      <Products products={products ?? ([] as ProductType[])} />
    </>
  );
}
