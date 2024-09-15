import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectAvailableSizes } from '@/lib/redux/features/products/productsSelector';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SizeFilter() {
  const router = useRouter();
  const availableSizes = useAppSelector(selectAvailableSizes);
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
        {availableSizes.map((size, index) => (
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
