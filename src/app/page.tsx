import Products from '@/components/Products';
import { Typography } from '@mui/material';

export default async function Home() {
  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', paddingTop: 5 }}>
        My E-commerce Website
      </Typography>
      <Products />
    </>
  );
}
