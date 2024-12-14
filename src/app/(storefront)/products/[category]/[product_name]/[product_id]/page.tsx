import ProductDetails from '@/components/product/productDetails/ProductDetails';
import { STORE_NAME } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { fetchProductByIdDynamic } from '@/services/db/queries/fetchProductsDynamic';
import { getAllProductsCached, getProductByIdCached } from '@/services/products/get';
import { getUserRoleFromSession } from '@/utils/auth';
import { notFound } from 'next/navigation';

type Params = {
  params: { product_id: string };
};

export async function generateMetadata({ params: { product_id } }: Params) {
  const supabase = await createSupabaseServerClient();
  const userRole = await getUserRoleFromSession(supabase);
  // Demo users signed in as admin require auth to view products they create
  const { data: product } =
    userRole === 'admin' ? await fetchProductByIdDynamic(product_id) : await getProductByIdCached(product_id);

  if (!product?.productId) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product?.name} | ${STORE_NAME}`,
  };
}

export default async function ProductPage({ params: { product_id } }: Params) {
  const supabase = await createSupabaseServerClient();
  const userRole = await getUserRoleFromSession(supabase);
  // Demo users signed in as admin require auth to view products they create
  const { data: product } =
    userRole === 'admin' ? await fetchProductByIdDynamic(product_id) : await getProductByIdCached(product_id);

  if (!product) return notFound();

  return <ProductDetails product={product} />;
}

export async function generateStaticParams() {
  const { data: productsData } = await getAllProductsCached();

  const products = productsData ?? [];

  return products.map((product) => ({
    category: product.category.toString().toLowerCase(),
    product_name: product.name.toLowerCase().split(' ').join('-'),
    product_id: product.productId.toString(),
  }));
}
