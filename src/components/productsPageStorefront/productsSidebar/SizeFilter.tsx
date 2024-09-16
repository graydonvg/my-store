'use client';

import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useRouter, useSearchParams } from 'next/navigation';
import { sortItemSizesArrayForStore } from '@/utils/sort';
import { useMemo } from 'react';

type Props = {
  sizes: string[];
};

export default function SizeFilter({ sizes }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortedSizes = useMemo(() => sizes.sort(sortItemSizesArrayForStore), [sizes]);
  const selectedSizes = Array.from(searchParams.values());

  function applySizeFilterToUrl(size: string, index: number) {
    const updatedParams = new URLSearchParams(searchParams);

    const paramName = `size_s[${index}]`;

    if (!searchParams.has(paramName)) {
      updatedParams.set(paramName, `${size}`);
    } else {
      updatedParams.delete(paramName);
    }

    router.push(`?${updatedParams}`);
  }

  return (
    <ProductsSidebarAccordion
      label="Sizes"
      defaultExpanded={false}>
      <FormGroup>
        {sortedSizes.map((size, index) => (
          <FormControlLabel
            key={size}
            control={
              <Checkbox
                checked={selectedSizes.includes(size)}
                onChange={() => applySizeFilterToUrl(size, index)}
              />
            }
            label={size}
          />
        ))}
      </FormGroup>
    </ProductsSidebarAccordion>
  );
}
