import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectProductsData } from '@/lib/redux/features/products/productsSelector';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BrandFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productsData = useAppSelector(selectProductsData);
  const productBrands = productsData?.map((data) => data.brand);
  const brandSet = new Set(productBrands);
  const brandsArray = Array.from(brandSet);
  const selectedBrands = Array.from(searchParams.values());

  function applyBrandFilter(brand: string, index: number) {
    const updatedParams = new URLSearchParams(searchParams);

    const paramName = `brand_s[${index}]`;

    if (!searchParams.has(paramName)) {
      console.log(false);

      updatedParams.set(paramName, `${brand}`);
    } else {
      console.log(true);

      updatedParams.delete(paramName);
    }

    router.push(`?${updatedParams}`);
  }

  return (
    <ProductsSidebarAccordion
      label="Brands"
      defaultExpanded={false}>
      <FormGroup>
        {brandsArray?.map((brand, index) => (
          <FormControlLabel
            key={brand}
            control={
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onChange={() => applyBrandFilter(brand, index)}
              />
            }
            label={brand}
          />
        ))}
      </FormGroup>
    </ProductsSidebarAccordion>
  );
}
