import ProductDetails from '@/components/ProductDetails';
import { getAllProducts, getProductById } from '@/services/products/get-products';
import { ProductType } from '@/types';

export const dynamic = 'force-dynamic';

type Params = {
  params: { product_id: string };
};

export async function generateMetadata({ params: { product_id } }: Params) {
  const { data } = await getProductById(product_id);

  const product = data ? data : ({} as ProductType);

  return {
    title: product?.name,
    description: `This is the product page for ${product?.name}`,
  };
}

export default async function ProductPage({ params: { product_id } }: Params) {
  const { data } = await getProductById(product_id);

  const product = data ? data : ({} as ProductType);

  return <ProductDetails product={product} />;
}

export async function generateStaticParams() {
  const { data: productsData } = await getAllProducts();

  const products = productsData ?? [];

  return products.map((product) => ({
    product_id: product.product_id.toString(),
  }));
}
