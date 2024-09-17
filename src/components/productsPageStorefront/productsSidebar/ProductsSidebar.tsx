import { Typography, Divider } from '@mui/material';
import BrandFilter from './BrandFilter';
import SizeFilter from './SizeFilter';
import PrimaryColourFilter from './PrimaryColourFilter';
import MaterialFilter from './MaterialFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { PriceRangeFilterType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export default async function ProductsSidebar() {
  const supabase = await createSupabaseServerClient();
  const { data: filterOptions } = await supabase.rpc('getProductFilterOptions');

  return (
    <>
      <Typography
        fontWeight="bold"
        fontSize={18}
        lineHeight={1.65}
        sx={{ padding: 2, cursor: 'default', letterSpacing: '1px' }}>
        Refine
      </Typography>
      <Divider />
      <BrandFilter brands={filterOptions?.[0].distinctBrands ?? []} />
      <Divider />
      <SizeFilter sizes={filterOptions?.[0].distinctSizes ?? []} />
      <Divider />
      <PrimaryColourFilter />
      <Divider />
      <MaterialFilter />
      <Divider />
      <PriceRangeFilter highestPrices={(filterOptions?.[0].highestPrices as PriceRangeFilterType) ?? {}} />
    </>
  );
}
