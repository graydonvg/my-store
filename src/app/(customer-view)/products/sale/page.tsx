import Products from '@/components/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { getProductsOnSale } from '@/services/products/get';

export default async function SaleProducts() {
  const { data: products } = await getProductsOnSale();

  return (
    <>
      <PageHeaderWithBorder label="SALE" />
      {products ? <Products products={products} /> : null}
    </>
  );
}
