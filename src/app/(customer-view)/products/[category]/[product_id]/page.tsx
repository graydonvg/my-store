import ProductDetails from '@/components/productDetails/ProductDetails';
import { getAllProducts, getProductById } from '@/services/products/get';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';
export const dynamicParams = false;

type Params = {
  params: { product_id: string };
};

export async function generateMetadata({ params: { product_id } }: Params) {
  const { data } = await getProductById(product_id);
  const product = data ? data : ({} as Product);

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

  const product = data ? data : ({} as Product);

  return <ProductDetails product={product} />;
}

export async function generateStaticParams() {
  const { data: productsData } = await getAllProducts();

  const products = productsData ?? [];

  return products.map((product) => ({
    category: product.category.toString().toLowerCase(),
    product_id: product.productId.toString(),
  }));
}
