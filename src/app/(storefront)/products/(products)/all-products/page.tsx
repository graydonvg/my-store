import Products, { ProductsSkeleton } from '@/components/product/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getAllProducts } from '@/services/products/get';
import { Product } from '@/types';
import { getObjectKeyCount } from '@/utils/checkObject';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: `All Products | ${CONSTANTS.STORE_NAME}`,
};

type Props = {
  searchParams: {
    brand: string | string[];
    size: string | string[];
    min_price: number;
    max_price: number;
  };
};

export default async function AllProductsPage({ searchParams }: Props) {
  if (!getObjectKeyCount(searchParams)) {
    const { data: products } = await getAllProducts();

    return (
      <>
        <PageHeaderWithBorder label="All Products" />
        {products ? <Products products={products} /> : 'No results.'}
      </>
    );
  } else {
    return (
      <>
        <PageHeaderWithBorder label="All Products" />
        <Suspense fallback={<ProductsSkeleton />}>
          <FilteredProducts searchParams={searchParams} />
        </Suspense>
      </>
    );
  }
}

async function FilteredProducts({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient();

  const { data: filteredProducts } = await supabase.rpc('filterProducts', {
    p_brands: searchParams.brand
      ? typeof searchParams.brand === 'string'
        ? [searchParams.brand]
        : searchParams.brand
      : undefined,
    p_sizes: searchParams.size
      ? typeof searchParams.size === 'string'
        ? [searchParams.size]
        : searchParams.size
      : undefined,
    p_min_price: searchParams.min_price ? searchParams.min_price : undefined,
    p_max_price: searchParams.max_price ? searchParams.max_price : undefined,
  });

  return <>{filteredProducts ? <Products products={filteredProducts as Product[]} /> : 'No results.'}</>;
}
