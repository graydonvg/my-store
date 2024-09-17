'use client';

import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  brands: string[];
};

const PARAM_NAME = 'brand';

export default function BrandFilter({ brands }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBrands = searchParams.getAll(PARAM_NAME);

  function applyBrandFilterToUrl(brand: string) {
    const updatedParams = new URLSearchParams(searchParams);

    if (!selectedBrands.includes(brand)) {
      updatedParams.append(PARAM_NAME, brand);
    } else {
      updatedParams.delete(PARAM_NAME, brand);
    }

    router.push(`?${updatedParams}`);
  }

  return (
    <ProductsSidebarAccordion
      label="Brands"
      defaultExpanded={false}>
      <FormGroup>
        {brands.map((brand) => (
          <FormControlLabel
            key={brand}
            control={
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onChange={() => applyBrandFilterToUrl(brand)}
              />
            }
            label={brand}
          />
        ))}
      </FormGroup>
    </ProductsSidebarAccordion>
  );
}
