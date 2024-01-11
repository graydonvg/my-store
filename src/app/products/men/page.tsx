import Products from '@/components/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { getProductsByCategory } from '@/services/products/get';

export default async function MenAllProducts() {
  const { data: products } = await getProductsByCategory('Men');

  return (
    <>
      <PageHeaderWithBorder label="Men" />
      <Products
        show={!!products}
        products={products!}
      />
    </>
  );
}
