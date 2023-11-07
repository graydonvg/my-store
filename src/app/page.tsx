import Products from '@/components/Products';
import serverClient from '@/lib/supabase-server';
import getAllProducts from '@/services/get-all-products';
import { ProductType } from '@/types';
import { Typography } from '@mui/material';

export default async function Home() {
  const supabase = await serverClient();
  // const { data: products } = await getAllProducts();
  const { data: products, error } = await supabase
    .from('products')
    .select('*, product_image_data(file_name, image_url, product_image_id, index)')
    .order('created_at', { ascending: false });

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
