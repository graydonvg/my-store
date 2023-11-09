import ProductDetails from '@/components/ui/ProductDetails';
import serverClient from '@/lib/supabase-server';
import getAllProducts from '@/services/products/get-all-products';
import { ProductType } from '@/types';

type Params = {
  params: { product_id: string };
};

export async function generateMetadata({ params: { product_id } }: Params) {
  // const { data: product } = await getProductById(product_id);
  const supabase = await serverClient();
  const { data } = await supabase
    .from('products')
    .select('*, product_image_data(file_name, image_url, product_image_id, index)')
    .eq('product_id', product_id);

  const product = data ? data[0] : ({} as ProductType);

  return {
    title: product?.name,
    description: `This is the product page for ${product?.name}`,
  };
}

export default async function ProductPage({ params: { product_id } }: Params) {
  // const { data: product } = await getProductById(product_id);
  const supabase = await serverClient();
  const { data } = await supabase
    .from('products')
    .select('*, product_image_data(file_name, image_url, product_image_id, index)')
    .eq('product_id', product_id);

  const product = data ? data[0] : ({} as ProductType);

  return <ProductDetails product={product ?? ({} as ProductType)} />;
}

export async function generateStaticParams() {
  const { data: productsData } = await getAllProducts();

  const products = productsData ?? [];

  return products.map((product) => ({
    product_id: product.product_id.toString(),
  }));
}
