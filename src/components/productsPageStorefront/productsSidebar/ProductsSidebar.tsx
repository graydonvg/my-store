'use client';

import { Typography, Divider, Box } from '@mui/material';
import BrandFilter from './BrandFilter';
import SizeFilter from './SizeFilter';
import PrimaryColourFilter from './PrimaryColourFilter';
import MaterialFilter from './MaterialFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { usePathname, useSearchParams } from 'next/navigation';
import { ProductsFilterOptions } from '@/types';
import Link from 'next/link';

type Props = {
  filterOptions: ProductsFilterOptions[] | null;
};

export default function ProductsSidebar({ filterOptions }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          component="span"
          fontWeight="bold"
          fontSize={16}
          lineHeight={1.85}
          sx={{ padding: 2, cursor: 'default', letterSpacing: '1px' }}>
          Refine
        </Typography>

        {searchParams.size ? (
          <Typography
            fontSize={14}
            lineHeight={1.85}
            color="textSecondary"
            sx={{
              padding: 2,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
            <Link href={pathname}>clear all</Link>
          </Typography>
        ) : null}
      </Box>
      <Divider />
      <BrandFilter brands={filterOptions?.[0].distinctBrands ?? []} />
      <Divider />
      <SizeFilter sizes={filterOptions?.[0].distinctSizes ?? []} />
      <Divider />
      <PrimaryColourFilter colors={filterOptions?.[0].distinctFilterColors ?? []} />
      <Divider />
      <MaterialFilter materials={filterOptions?.[0].distinctFilterMaterials ?? []} />
      <Divider />
      <PriceRangeFilter maxPrice={filterOptions?.[0].maxPrice ?? 0} />
    </>
  );
}
