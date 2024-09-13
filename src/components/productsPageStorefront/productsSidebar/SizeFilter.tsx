import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { CONSTANTS } from '@/constants';

export default function SizeFilter() {
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
