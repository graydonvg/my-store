'use client';

import { useEffect, useMemo, useState } from 'react';
import { Typography, Checkbox, FormGroup, FormControlLabel, Divider, Box, Slider, Tooltip } from '@mui/material';
import useDebounce from '@/hooks/useDebouce';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONSTANTS } from '@/constants';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { formatCurrency } from '@/utils/format';

const DEFAULT_PRICE_RANGE = [0, 12000];

export default function ProductsPageSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState(DEFAULT_PRICE_RANGE);
  const [selectedColors, setSelectedColors] = useState(['']);
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
    <>
      <Typography
        fontWeight="bold"
        fontSize={18}
        lineHeight={1.65}
        sx={{ padding: 2, cursor: 'default', letterSpacing: '1px' }}>
        Refine
      </Typography>

      <Divider />

      {/* Brand Filter */}
      <ProductsSidebarAccordion
        label="Brands"
        defaultExpanded={false}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="H&M"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Mango"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Levi's"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Guess"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="G-Star RAW"
          />
        </FormGroup>
      </ProductsSidebarAccordion>

      <Divider />

      {/* Size Filter */}
      <ProductsSidebarAccordion
        label="Sizes"
        defaultExpanded={false}>
        <FormGroup>
          {CONSTANTS.ORDERED_SIZES_FOR_STORE.map((size) => (
            <FormControlLabel
              key={size}
              control={<Checkbox />}
              label={size}
            />
          ))}
        </FormGroup>
      </ProductsSidebarAccordion>

      <Divider />

      {/* Primary Colour Filter */}
      <ProductsSidebarAccordion
        label="Primary colour"
        defaultExpanded={true}>
        <FormGroup>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Multi'].map((color) => (
              <Box
                key={color}
                sx={{ position: 'relative', width: 18, height: 18 }}>
                <FormControlLabel
                  control={<span />}
                  label={
                    <Tooltip
                      title={<Typography>{color}</Typography>}
                      placement="top"
                      arrow>
                      <Box
                        onClick={() =>
                          setSelectedColors((prevColors) =>
                            prevColors.includes(color)
                              ? prevColors.filter((prevColor) => prevColor !== color)
                              : [...prevColors, color]
                          )
                        }
                        sx={{
                          backgroundColor: color,
                          border: '1px solid grey',
                          width: 1,
                          height: 1,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          ...(color === 'Multi' && {
                            background: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
                          }),
                          ...(selectedColors.includes(color) && {
                            outline: '2px solid grey',
                            outlineOffset: 2,
                          }),
                        }}
                      />
                    </Tooltip>
                  }
                />
              </Box>
            ))}
          </Box>
        </FormGroup>
      </ProductsSidebarAccordion>

      <Divider />

      {/* Material Filter */}
      <ProductsSidebarAccordion
        label="Material"
        defaultExpanded={false}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox />}
            label="Cotton"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Polyester"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Denim"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Linen"
          />
        </FormGroup>
      </ProductsSidebarAccordion>

      <Divider />

      {/* Price Range Filter */}
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
    </>
  );
}
