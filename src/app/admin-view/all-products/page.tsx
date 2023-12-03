import Products from '@/components/Products';
import RevalidateButton from '@/components/RevalidateButton';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import getAllProducts from '@/services/products/get-all-products';
import { ProductType } from '@/types';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';

export default async function AdminViewAllProducts() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: user } = await supabase.from('users').select('*');

  if (!session || !user || user[0].is_admin === false) notFound();

  const { data: products } = await getAllProducts();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1.75 }}>
      <RevalidateButton />
      <Products products={products ?? ([] as ProductType[])} />
    </Box>
  );
}
