import ProductDetails from '@/components/ProductDetails';
import { getAllProducts, getProductById } from '@/services/products/get-products';
import { ProductType } from '@/types';
import { notFound } from 'next/navigation';

type Params = {
  params: { product_id: string };
};

export async function generateMetadata({ params: { product_id } }: Params) {
  const { data } = await getProductById(product_id);
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

export default async function ProductPage({ params: { product_id } }: Params) {
  const { data } = await getProductById(product_id);

  const product = data ? data : ({} as ProductType);

  if (!product.productId) notFound();

  return <ProductDetails product={product} />;
}

export async function generateStaticParams() {
  const { data: productsData } = await getAllProducts();

  const products = productsData ?? [];

  return products.map((product) => ({
    product_id: product.productId.toString(),
  }));
}
