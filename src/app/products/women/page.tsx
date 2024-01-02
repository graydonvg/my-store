import Products from '@/components/Products';
import { getProductsByCategory } from '@/services/products/get-products';
import { Typography } from '@mui/material';

export default async function WomenAllProducts() {
  const { data: products } = await getProductsByCategory('Women');

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', paddingBottom: 2 }}>
        Women
      </Typography>
      <Products
        show={!!products}
        products={products!}
      />
    </>
  );
}
