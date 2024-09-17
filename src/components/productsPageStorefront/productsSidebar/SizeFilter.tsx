'use client';

import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useRouter, useSearchParams } from 'next/navigation';
import { sortItemSizesArrayForStore } from '@/utils/sort';
import { useMemo } from 'react';

type Props = {
  sizes: string[];
};

const PARAM_NAME = 'size';

export default function SizeFilter({ sizes }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortedSizes = useMemo(() => sizes.sort(sortItemSizesArrayForStore), [sizes]);
  const selectedSizes = searchParams.getAll(PARAM_NAME);

  function applySizeFilterToUrl(size: string) {
    const updatedParams = new URLSearchParams(searchParams);

    if (!selectedSizes.includes(size)) {
      updatedParams.append(PARAM_NAME, size);
    } else {
      updatedParams.delete(PARAM_NAME, size);
    }

    router.push(`?${updatedParams}`);
  }

  return (
    <ProductsSidebarAccordion
      label="Sizes"
      defaultExpanded={false}>
      <FormGroup>
        {sortedSizes.map((size) => (
          <FormControlLabel
            key={size}
            control={
              <Checkbox
                checked={selectedSizes.includes(size)}
                onChange={() => applySizeFilterToUrl(size)}
              />
            }
            label={size}
          />
        ))}
      </FormGroup>
    </ProductsSidebarAccordion>
  );
}
