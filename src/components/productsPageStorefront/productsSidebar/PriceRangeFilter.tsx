'use client';

import { Box, Slider, Typography } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatCurrency } from '@/utils/formatting';

type Props = {
  maxPrice: number;
};

export default function PriceRangeFilter({ maxPrice }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roundedHighestPrice = Math.ceil(maxPrice / 100) * 100;
  const priceRange = useMemo(() => [0, roundedHighestPrice], [roundedHighestPrice]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRange);
  const selectedLowerPriceRange = useMemo(() => formatCurrency(selectedPriceRange[0]), [selectedPriceRange]);
  const selectedUpperPriceRange = useMemo(() => formatCurrency(selectedPriceRange[1]), [selectedPriceRange]);

  useEffect(() => {
    if (!searchParams.get('min_price') && !searchParams.get('max_price')) return;

    if (!isNaN(Number(searchParams.get('min_price'))) && !isNaN(Number(searchParams.get('max_price')))) return;

    const updatedParams = new URLSearchParams(searchParams);

    if (searchParams.get('min_price') && isNaN(Number(searchParams.get('min_price')))) {
      updatedParams.delete('min_price');
    }

    if (searchParams.get('max_price') && isNaN(Number(searchParams.get('max_price')))) {
      updatedParams.delete('max_price');
    }

    router.push(`?${updatedParams}`);
  }, [router, searchParams]);

  useEffect(() => {
    const urlMinPrice = !isNaN(Number(searchParams.get('min_price')))
      ? Number(searchParams.get('min_price'))
      : priceRange[0];
    const urlMaxPrice = !isNaN(Number(searchParams.get('max_price')))
      ? Number(searchParams.get('max_price'))
      : priceRange[1];

    const currentMinPrice = searchParams.get('min_price') ? urlMinPrice : priceRange[0];
    const currentMaxPrice = searchParams.get('max_price') ? urlMaxPrice : priceRange[1];

    setSelectedPriceRange([currentMinPrice, currentMaxPrice]);
  }, [searchParams, priceRange]);

  function applyPriceFilterToUrl() {
    const updatedParams = new URLSearchParams(searchParams);

    if (selectedPriceRange[0] !== priceRange[0]) {
      if (searchParams.has('max_price') && !searchParams.has('min_price')) {
        // Keep ordered (min then max price)
        updatedParams.delete('max_price');
        updatedParams.set('min_price', `${selectedPriceRange[0]}`);
        updatedParams.set('max_price', `${selectedPriceRange[1]}`);
      }
      updatedParams.set('min_price', `${selectedPriceRange[0]}`);
    } else {
      updatedParams.delete('min_price');
    }

    if (selectedPriceRange[1] !== priceRange[1]) {
      updatedParams.set('max_price', `${selectedPriceRange[1]}`);
    } else {
      updatedParams.delete('max_price');
    }

    router.push(`?${updatedParams}`);
  }

  return (
    <ProductsSidebarAccordion
      label="Price"
      defaultExpanded={true}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography>{selectedLowerPriceRange}</Typography>
          <Typography>{selectedUpperPriceRange}</Typography>
        </Box>
        <Slider
          value={selectedPriceRange}
          onChange={(_e, newValue) => setSelectedPriceRange(newValue as number[])}
          onChangeCommitted={applyPriceFilterToUrl}
          valueLabelDisplay="off"
          min={priceRange[0]}
          max={priceRange[1]}
          step={50}
        />
      </Box>
    </ProductsSidebarAccordion>
  );
}
