'use client';

import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ProductsSidebarAccordion from './ProductsSidebarAccordion';
import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  materials: string[];
};

const PARAM_NAME = 'material';

export default function MaterialFilter({ materials }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedMaterials = searchParams.getAll(PARAM_NAME);

  function applyMaterialFilterToUrl(material: string) {
    const updatedParams = new URLSearchParams(searchParams);

    if (!selectedMaterials.includes(material)) {
      updatedParams.append(PARAM_NAME, material);
    } else {
      updatedParams.delete(PARAM_NAME, material);
    }

    router.push(`?${updatedParams}`);
  }

  return (
    <ProductsSidebarAccordion
      label="Material"
      defaultExpanded={false}>
      <FormGroup>
        {materials.map((material) => (
          <FormControlLabel
            key={material}
            control={
              <Checkbox
                checked={selectedMaterials.includes(material)}
                onChange={() => applyMaterialFilterToUrl(material)}
              />
            }
            label={material}
          />
        ))}
      </FormGroup>
    </ProductsSidebarAccordion>
  );
}
