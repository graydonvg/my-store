import ProductDetails from '@/components/ui/ProductDetails';
import getAllProducts from '@/services/products/get-all-products';
import getProductById from '@/services/products/get-product-by-id';
import { ProductType } from '@/types';

type Props = {
  params: { product_id: string };
};

export default async function ProductPage({ params }: Props) {
  const { data: product } = await getProductById(params.product_id);

  return <ProductDetails product={product ?? ({} as ProductType)} />;
}

export async function generateStaticParams() {
  const { data: products } = await getAllProducts();

  return products?.map((product) => ({
    product_id: product.product_id,
  }));
}
