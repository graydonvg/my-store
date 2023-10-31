import Products from '@/components/Products';
import { Database } from '@/lib/database.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: products } = await supabase.from('products').select('*, product_image_data(file_name, image_url)');

  return (
    <>
      {/* <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', padding: 4 }}>
        My E-commerce Website
      </Typography> */}
      <Products products={products ?? []} />
    </>
  );
}
