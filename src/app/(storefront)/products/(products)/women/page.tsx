import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getProductsByCategoryCached } from '@/services/products/get';
import { Product } from '@/types';
import { getObjectKeyCount } from '@/utils/objectHelpers';
import { Metadata } from 'next';
import { Logger } from 'next-axiom';
import ProductsLayout from '../ProductsLayout';
import { STORE_NAME } from '@/constants';
import { getUserRoleFromSession } from '@/utils/auth';
import { fetchProductsByCategoryDynamic } from '@/services/db/queries/fetchProductsDynamic';

const log = new Logger();

const CATEGORY = 'Women';

export const metadata: Metadata = {
  title: `${CATEGORY}'s Fashion | ${STORE_NAME}`,
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

export default async function WomensProductsPage({ searchParams }: Props) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('getProductFilterOptions', { category_input: CATEGORY });

  if (error) {
    log.error('Failed to get products filter options', { error });
  }

  if (!getObjectKeyCount(searchParams)) {
    const userRole = await getUserRoleFromSession(supabase);
    // Demo users signed in as admin require auth to view products they create
    const { data: products } =
      userRole === 'admin'
        ? await fetchProductsByCategoryDynamic(CATEGORY)
        : await getProductsByCategoryCached(CATEGORY);
    return (
      <ProductsLayout
        header={CATEGORY}
        filterOptions={data}
        products={products}
      />
    );
  } else {
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
      p_category: CATEGORY,
    });

    return (
      <ProductsLayout
        header={CATEGORY}
        filterOptions={data}
        products={filteredProducts as Product[]}
      />
    );
  }
}
