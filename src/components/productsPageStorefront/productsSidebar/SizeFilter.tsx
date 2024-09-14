import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { CONSTANTS } from '@/constants';
// import { useAppSelector } from '@/lib/redux/hooks';
// import { selectProductsData } from '@/lib/redux/features/products/productsSelector';

export default function SizeFilter() {
  // const productsData = useAppSelector(selectProductsData);

  return (
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
  );
}
