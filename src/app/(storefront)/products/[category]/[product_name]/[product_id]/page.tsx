import ProductDetails from '@/components/product/productDetails/ProductDetails';
import { CONSTANTS } from '@/constants';
import { getAllProducts, getProductById } from '@/services/products/get';
import { notFound } from 'next/navigation';

type Params = {
  params: { product_id: string };
};

export async function generateMetadata({ params: { product_id } }: Params) {
  const { data: product } = await getProductById(product_id);

  if (!product?.productId) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product?.name} | ${CONSTANTS.STORE_NAME}`,
  };
}

export default async function ProductPage({ params: { product_id } }: Params) {
  const { data: product } = await getProductById(product_id);

  if (!product) return notFound();

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
