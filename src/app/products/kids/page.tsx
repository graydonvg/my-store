import Products from '@/components/Products';
import { getProductsByCategory } from '@/services/products/get-products';
import { Typography } from '@mui/material';

export default async function KidsAllProducts() {
  const { data: products } = await getProductsByCategory('kids');

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', paddingBottom: 2 }}>
        kids
      </Typography>
      <Products
        show={!!products}
        products={products!}
      />
    </>
  );
}
