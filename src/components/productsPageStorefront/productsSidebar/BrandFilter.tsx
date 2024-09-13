import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';

export default function BrandFilter() {
  return (
    <ProductsSidebarAccordion
      label="Brands"
      defaultExpanded={false}>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox />}
          label="H&M"
        />
        <FormControlLabel
          control={<Checkbox />}
          label="Mango"
        />
        <FormControlLabel
          control={<Checkbox />}
          label="Levi's"
        />
        <FormControlLabel
          control={<Checkbox />}
          label="Guess"
        />
        <FormControlLabel
          control={<Checkbox />}
          label="G-Star RAW"
        />
      </FormGroup>
    </ProductsSidebarAccordion>
  );
}
