import ProductDetails from '@/components/ProductDetails';
import { getAllProducts, getProductById } from '@/services/products/get-products';
import { ProductType } from '@/types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Params = {
  params: { productId: string };
};

export async function generateMetadata({ params: { productId } }: Params) {
  const { data } = await getProductById(productId);
  const product = data ? data : ({} as ProductType);

  if (!product.productId) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product?.name,
    description: `This is the product page for ${product?.name}`,
  };
}

export default async function ProductPage({ params: { productId } }: Params) {
  const { data } = await getProductById(productId);

  const product = data ? data : ({} as ProductType);

  if (!product.productId) notFound();

  return <ProductDetails product={product} />;
}

export async function generateStaticParams() {
  const { data: productsData } = await getAllProducts();

  const products = productsData ?? [];

  return products.map((product) => ({
    productId: product.productId.toString(),
  }));
}
