import { Box, Slider, Typography } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useDebounce from '@/hooks/useDebouce';
import { formatCurrency } from '@/utils/format';

const DEFAULT_PRICE_RANGE = [0, 12000];

export default function PriceRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const debouncedValue = useDebounce<number[]>(priceRange, 300);
  const lowerPriceRange = useMemo(() => formatCurrency(priceRange[0]), [priceRange]);
  const upperPriceRange = useMemo(() => formatCurrency(priceRange[1]), [priceRange]);

  function handlePriceRangeChange(_event: Event, newValue: number | number[]) {
    setPriceRange(newValue as number[]);
  }

  useEffect(() => {
    const updatedParams = new URLSearchParams(searchParams.toString());

    if (debouncedValue[0] !== DEFAULT_PRICE_RANGE[0]) {
      updatedParams.set('min_price', `${debouncedValue[0]}`);
    } else {
      updatedParams.delete('min_price');
    }

    if (debouncedValue[1] !== DEFAULT_PRICE_RANGE[1]) {
      updatedParams.set('max_price', `${debouncedValue[1]}`);
    } else {
      updatedParams.delete('max_price');
    }

    const orderedParams = new URLSearchParams();

    if (updatedParams.has('min_price')) {
      orderedParams.set('min_price', updatedParams.get('min_price') ?? '');
    }

    if (updatedParams.has('max_price')) {
      orderedParams.set('max_price', updatedParams.get('max_price') ?? '');
    }

    if (orderedParams.toString() !== searchParams.toString()) {
      router.push(`?${orderedParams}`);
    }
  }, [debouncedValue, router, searchParams]);
  return (
    <ProductsSidebarAccordion
      label="Price"
      defaultExpanded={true}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>{lowerPriceRange}</Typography>
          <Typography>{upperPriceRange}</Typography>
        </Box>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="off"
          min={DEFAULT_PRICE_RANGE[0]}
          max={DEFAULT_PRICE_RANGE[1]}
          step={50}
        />
      </Box>
    </ProductsSidebarAccordion>
  );
}
