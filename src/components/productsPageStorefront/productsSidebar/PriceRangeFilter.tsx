import { Box, Slider, Typography } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatCurrency } from '@/utils/format';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectPriceRange } from '@/lib/redux/features/products/productsSelector';

export default function PriceRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const maxPriceRage = useAppSelector(selectPriceRange);
  const [selectedPriceRange, setSelectedPriceRange] = useState(maxPriceRage);
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
      : maxPriceRage[0];
    const urlMaxPrice = !isNaN(Number(searchParams.get('max_price')))
      ? Number(searchParams.get('max_price'))
      : maxPriceRage[1];

    const currentMinPrice = searchParams.get('min_price') ? urlMinPrice : maxPriceRage[0];
    const currentMaxPrice = searchParams.get('max_price') ? urlMaxPrice : maxPriceRage[1];

    setSelectedPriceRange([currentMinPrice, currentMaxPrice]);
  }, [maxPriceRage, searchParams]);

  function applyPriceFilterToUrl() {
    const updatedParams = new URLSearchParams(searchParams);

    if (selectedPriceRange[0] !== maxPriceRage[0]) {
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

    if (selectedPriceRange[1] !== maxPriceRage[1]) {
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
          min={maxPriceRage[0]}
          max={maxPriceRage[1]}
          step={50}
        />
      </Box>
    </ProductsSidebarAccordion>
  );
}
