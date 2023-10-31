import Products from '@/components/Products';
import { Database } from '@/lib/database.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type AdminViewProps = {};

export default async function AdminView() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: products } = await supabase.from('products').select('*, product_image_data(file_name, image_url)');

  return <Products products={products ?? []} />;
}
