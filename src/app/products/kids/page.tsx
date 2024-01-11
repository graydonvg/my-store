import Products from '@/components/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { getProductsByCategory } from '@/services/products/get';

export default async function KidsAllProducts() {
  const { data: products } = await getProductsByCategory('kids');

  return (
    <>
      <PageHeaderWithBorder label="kids" />
      <Products
        show={!!products}
        products={products!}
      />
    </>
  );
}
