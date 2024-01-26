import Products from '@/components/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { getProductsByCategory } from '@/services/products/get';

export default async function KidsAllProducts() {
  const { data: products } = await getProductsByCategory('Kids');

  return (
    <>
      <PageHeaderWithBorder label="Kids" />
      <Products
        show={!!products}
        products={products!}
      />
    </>
  );
}
