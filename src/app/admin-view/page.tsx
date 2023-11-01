import Products from '@/components/Products';
import serverClient from '@/lib/supabase-server';

type AdminViewProps = {};

export default async function AdminView() {
  const supabase = await serverClient();
  const { data: products } = await supabase.from('products').select('*, product_image_data(file_name, image_url)');

  return <Products products={products ?? []} />;
}
