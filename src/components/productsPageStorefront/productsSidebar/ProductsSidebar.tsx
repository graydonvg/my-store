import { Typography, Divider } from '@mui/material';
import BrandFilter from './BrandFilter';
import SizeFilter from './SizeFilter';
import PrimaryColourFilter from './PrimaryColourFilter';
import MaterialFilter from './MaterialFilter';
import PriceRangeFilter from './PriceRangeFilter';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { PriceRangeFilterType } from '@/types';

export default async function ProductsSidebar() {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase.rpc('getProductFilterOptions');

  console.log(data);

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
      <BrandFilter brands={data?.[0].distinctBrands ?? []} />
      <Divider />
      <SizeFilter sizes={data?.[0].distinctSizes ?? []} />
      <Divider />
      <PrimaryColourFilter />
      <Divider />
      <MaterialFilter />
      <Divider />
      <PriceRangeFilter highestPrices={(data?.[0].highestPrices as PriceRangeFilterType) ?? {}} />
    </>
  );
}
