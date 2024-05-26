import ProductDetails from '@/components/product/productDetails/ProductDetails';
import { getAllProducts, getProductById } from '@/services/products/get';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type Params = {
  params: { product_id: string };
};

export async function generateMetadata({ params: { product_id } }: Params) {
  const { data } = await getProductById(product_id);

  if (!data?.productId) {
    return {
      title: 'Product Not Found',
    };
  }

  const product = data;

  return {
    title: product?.name,
    description: `This is the product page for ${product?.name}`,
  };
}

export default async function ProductPage({ params: { product_id } }: Params) {
  const { data } = await getProductById(product_id);

  if (!data) return notFound();

  const product = data;

  return <ProductDetails product={product} />;
}

export async function generateStaticParams() {
  const { data: productsData } = await getAllProducts();

  const products = productsData ?? [];

  return products.map((product) => ({
    category: product.category.toString().toLowerCase(),
    product_name: product.name.toLowerCase().split(' ').join('-'),
    product_id: product.productId.toString(),
  }));
}
