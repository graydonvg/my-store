import Products from '@/components/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { getProductsOnSale } from '@/services/products/get';

export default async function MenAllProducts() {
  const { data: products } = await getProductsOnSale();

  return (
    <>
      <PageHeaderWithBorder label="SALE" />
      <Products
        show={!!products}
        products={products!}
      />
    </>
  );
}
