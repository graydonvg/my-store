'use client';

import { Typography, Divider, Skeleton, Box } from '@mui/material';
import BrandFilter from './BrandFilter';
import SizeFilter from './SizeFilter';
import PrimaryColourFilter from './PrimaryColourFilter';
import MaterialFilter from './MaterialFilter';
import PriceRangeFilter from './PriceRangeFilter';
import { useProductFilterOptions } from '@/hooks/useProductFilterOptions';
import { usePathname, useSearchParams } from 'next/navigation';
import { ProductCategory } from '@/types';
import { CONSTANTS } from '@/constants';
import Link from 'next/link';

export default function ProductsSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryName = pathname.split('/products/')[1];
  const categoryCapitalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const getSaleFilterOptions = pathname.includes('/sale');
  const category = !pathname.includes('/all-products') && !pathname.includes('/sale') ? categoryCapitalized : undefined;
  const { data: filterOptions, isLoading } = useProductFilterOptions({
    category: category as ProductCategory | undefined,
    onSale: getSaleFilterOptions,
    pathname,
  });

  return (
    <>
      {!isLoading ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              fontWeight="bold"
              fontSize={16}
              lineHeight={1.65}
              sx={{ padding: 2, cursor: 'default', letterSpacing: '1px' }}>
              Refine
            </Typography>

            {searchParams.size ? (
              <Typography
                fontSize={14}
                lineHeight={1.65}
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
          <BrandFilter brands={filterOptions?.data?.[0].distinctBrands ?? []} />
          <Divider />
          <SizeFilter sizes={filterOptions?.data?.[0].distinctSizes ?? []} />
          <Divider />
          <PrimaryColourFilter colors={filterOptions?.data?.[0].distinctFilterColors ?? []} />
          <Divider />
          <MaterialFilter materials={filterOptions?.data?.[0].distinctFilterMaterials ?? []} />
          <Divider />
          <PriceRangeFilter maxPrice={filterOptions?.data?.[0].maxPrice ?? 0} />
        </>
      ) : (
        <Skeleton
          sx={{ height: 1, width: 1, borderRadius: CONSTANTS.BORDER_RADIUS }}
          variant="rectangular"
        />
      )}
    </>
  );
}
