import Products from '@/components/Products';
import { getProductsFromDatabase } from '@/lib/firebase';
import { Typography } from '@mui/material';

export default async function Home() {
  const categoriesAndProducts = await getProductsFromDatabase();

  return (
    <>
      {/* <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', padding: 4 }}>
        My E-commerce Website
      </Typography> */}
      <Products categoriesAndProducts={categoriesAndProducts} />
    </>
  );
}
