import Products from '@/components/product/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { CONSTANTS } from '@/constants';
import { getProductsOnSale } from '@/services/products/get';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Sale | ${CONSTANTS.STORE_NAME}`,
};

export default async function SaleProductsPage() {
  const { data: products } = await getProductsOnSale();

  return (
    <>
      <PageHeaderWithBorder label="SALE" />
      {products ? <Products products={products} /> : 'No results.'}
    </>
  );
}
