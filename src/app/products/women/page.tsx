import Products from '@/components/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { getProductsByCategory } from '@/services/products/get';

export default async function WomensProducts() {
  const { data: products } = await getProductsByCategory('Women');

  return (
    <>
      <PageHeaderWithBorder label="Women" />
      {products ? <Products products={products} /> : null}
    </>
  );
}
