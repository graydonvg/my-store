import { Box, Slider, Typography } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useDebounce from '@/hooks/useDebouce';
import { formatCurrency } from '@/utils/format';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectProductsData } from '@/lib/redux/features/products/productsSelector';
import { calculateRoundedDiscountedPrice } from '@/utils/calculate';

const DEFAULT_PRICE_RANGE = [0, 0];

export default function PriceRangeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productsData = useAppSelector(selectProductsData);
  const productPrices = productsData?.map((data) =>
    data.isOnSale ? calculateRoundedDiscountedPrice(data.price, data.salePercentage) : data.price
  );
  const sortedPrices = productPrices?.sort((a, b) => a - b);
  const upperPriceRange = sortedPrices?.at(-1) ?? 0;
  const roundedUpperPriceRange = Math.ceil(upperPriceRange / 100) * 100;
  const priceRage = useMemo(() => [0, roundedUpperPriceRange], [roundedUpperPriceRange]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const debouncedValue = useDebounce<number[]>(selectedPriceRange, 300);
  const selectedLowerPriceRange = useMemo(() => formatCurrency(selectedPriceRange[0]), [selectedPriceRange]);
  const selectedUpperPriceRange = useMemo(() => formatCurrency(selectedPriceRange[1]), [selectedPriceRange]);

  function handlePriceRangeChange(_event: Event, newValue: number | number[]) {
    setSelectedPriceRange(newValue as number[]);
  }

  useEffect(() => {
    setSelectedPriceRange(priceRage);
  }, [priceRage]);

  useEffect(() => {
    const updatedParams = new URLSearchParams(searchParams);

    if (debouncedValue[0] !== priceRage[0]) {
      if (searchParams.has('max_price') && !searchParams.has('min_price')) {
        // Keep ordered (min then max price)
        updatedParams.delete('max_price');
        updatedParams.set('min_price', `${debouncedValue[0]}`);
        updatedParams.set('max_price', `${debouncedValue[1]}`);
      }

      updatedParams.set('min_price', `${debouncedValue[0]}`);
    } else {
      updatedParams.delete('min_price');
    }

    if (debouncedValue[1] !== priceRage[1]) {
      updatedParams.set('max_price', `${debouncedValue[1]}`);
    } else {
      updatedParams.delete('max_price');
    }

    router.push(`?${updatedParams}`);
  }, [debouncedValue, priceRage, router, searchParams]);

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
          onChange={handlePriceRangeChange}
          valueLabelDisplay="off"
          min={priceRage[0]}
          max={priceRage[1]}
          step={50}
        />
      </Box>
    </ProductsSidebarAccordion>
  );
}
