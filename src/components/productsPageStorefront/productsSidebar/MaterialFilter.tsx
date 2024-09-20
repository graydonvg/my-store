'use client';

import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';

export default function MaterialFilter() {
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