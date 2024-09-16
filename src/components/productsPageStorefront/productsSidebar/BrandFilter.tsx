'use client';

import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  brands: string[];
};

export default function BrandFilter({ brands }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedBrands = Array.from(searchParams.values());

  function applyBrandFilterToUrl(brand: string, index: number) {
    const updatedParams = new URLSearchParams(searchParams);

    const paramName = `brand_s[${index}]`;

    if (!searchParams.has(paramName)) {
      updatedParams.set(paramName, `${brand}`);
    } else {
      updatedParams.delete(paramName);
    }

    router.push(`?${updatedParams}`);
  }

  return (
    <ProductsSidebarAccordion
      label="Brands"
      defaultExpanded={false}>
      <FormGroup>
        {brands.map((brand, index) => (
          <FormControlLabel
            key={brand}
            control={
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onChange={() => applyBrandFilterToUrl(brand, index)}
              />
            }
            label={brand}
          />
        ))}
      </FormGroup>
    </ProductsSidebarAccordion>
  );
}
