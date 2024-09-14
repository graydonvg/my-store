import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
// import { useAppSelector } from '@/lib/redux/hooks';
// import { selectProductsData } from '@/lib/redux/features/products/productsSelector';

export default function MaterialFilter() {
  // const productsData = useAppSelector(selectProductsData);

  return (
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
  );
}
