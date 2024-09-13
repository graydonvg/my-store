'use client';

import { Typography, Divider } from '@mui/material';
import BrandFilter from './BrandFilter';
import SizeFilter from './SizeFilter';
import PrimaryColourFilter from './PrimaryColourFilter';
import MaterialFilter from './MaterialFilter';
import PriceRangeFilter from './PriceRangeFilter';

export default function ProductsSidebar() {
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
      <BrandFilter />
      <Divider />
      <SizeFilter />
      <Divider />
      <PrimaryColourFilter />
      <Divider />
      <MaterialFilter />
      <Divider />
      <PriceRangeFilter />
    </>
  );
}
