import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONSTANTS } from '@/constants';

export default function SizeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
        {CONSTANTS.ORDERED_SIZES_FOR_STORE.map((size, index) => (
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
