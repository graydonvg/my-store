import Products, { ProductsSkeleton } from '@/components/product/Products';
import PageHeaderWithBorder from '@/components/ui/PageHeaderWithBorder';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getProductsByCategory } from '@/services/products/get';
import { Product } from '@/types';
import { getObjectKeyCount } from '@/utils/objectHelpers';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: `Men's Fashion | ${CONSTANTS.STORE_NAME}`,
};

type Props = {
  searchParams: {
    brand: string | string[];
    size: string | string[];
    colour: string | string[];
    material: string | string[];
    min_price: number;
    max_price: number;
  };
};

export default async function MensProductsPage({ searchParams }: Props) {
  const category = 'Men';

  if (!getObjectKeyCount(searchParams)) {
    const { data: products } = await getProductsByCategory(category);

    return (
      <>
        <PageHeaderWithBorder label={category} />
        {products ? <Products products={products} /> : 'No results.'}
      </>
    );
  } else {
    return (
      <>
        <PageHeaderWithBorder label={category} />
        <Suspense fallback={<ProductsSkeleton />}>
          <FilteredProducts
            searchParams={searchParams}
            category={category}
          />
        </Suspense>
      </>
    );
  }
}

async function FilteredProducts({ searchParams, category }: Props & { category: string }) {
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
    p_filter_colors: searchParams.colour
      ? typeof searchParams.colour === 'string'
        ? [searchParams.colour]
        : searchParams.colour
      : undefined,
    p_filter_materials: searchParams.material
      ? typeof searchParams.material === 'string'
        ? [searchParams.material]
        : searchParams.material
      : undefined,
    p_min_price: searchParams.min_price ? searchParams.min_price : undefined,
    p_max_price: searchParams.max_price ? searchParams.max_price : undefined,
    p_category: category,
  });

  return <>{filteredProducts ? <Products products={filteredProducts as Product[]} /> : 'No results.'}</>;
}
