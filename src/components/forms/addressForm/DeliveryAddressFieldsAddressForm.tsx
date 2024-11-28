import { Grid2, Typography, useTheme } from '@mui/material';
import CustomTextField from '../../ui/CustomTextField';
import { ChangeEvent } from 'react';
import { InsertAddress, UpdateAddress } from '@/types';

const fieldConfigs = [
  {
    label: 'Complex / Building',
    id: 'complex-or-building',
    name: 'complexOrBuilding',
    placeholder: 'Name, unit number or floor',
    ariaDescribedBy: 'complex-or-building-helper-text',
    required: false,
  },
  {
    label: 'Street address',
    id: 'street-address',
    name: 'streetAddress',
    placeholder: 'e.g. 24 Kingfisher Walk',
    ariaDescribedBy: 'street-address-helper-text',
    required: true,
  },
  {
    label: 'Suburb',
    id: 'suburb',
    name: 'suburb',
    placeholder: 'e.g. Pinelands',
    ariaDescribedBy: 'suburb-helper-text',
    required: true,
  },
  {
    label: 'Province',
    id: 'province',
    name: 'province',
    placeholder: 'e.g. Western Cape',
    ariaDescribedBy: 'province-helper-text',
    required: true,
  },
  {
    label: 'City',
    id: 'city',
    name: 'city',
    placeholder: 'e.g. Cape Town',
    ariaDescribedBy: 'city-helper-text',
    required: true,
  },
  {
    label: 'Postal code',
    id: 'postal-code',
    name: 'postalCode',
    type: 'number',
    placeholder: 'e.g. 7405',
    ariaDescribedBy: 'postal-code-helper-text',
    required: true,
  },
];

type Props = {
  addressData: Partial<InsertAddress> | Partial<UpdateAddress>;
  addressErrors: {
    complexOrBuilding?: string | null;
    streetAddress?: string | null;
    suburb?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
  };
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function DeliveryAddressFieldsAddressForm({ addressData, addressErrors, onChange }: Props) {
  const theme = useTheme();

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === 'postalCode') {
      const numericValue = parseInt(value, 10);
      if (numericValue > 9999) return;
    }

    onChange(event);
  }

  return (
    <Grid2
      container
      spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Typography fontSize={18}>Delivery Address</Typography>
      </Grid2>
      {fieldConfigs.map((field) => (
        <Grid2
          key={field.id}
          size={{ xs: 12 }}>
          <CustomTextField
            label={field.label}
            id={field.id}
            name={field.name}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            value={addressData[field.name as keyof typeof addressData]}
            onChange={handleChange}
            hasValue={!!addressData[field.name as keyof typeof addressData]}
            required={field.required}
            aria-invalid={!!addressErrors[field.name as keyof typeof addressErrors]}
            error={!!addressErrors[field.name as keyof typeof addressErrors]}
            helperText={addressErrors[field.name as keyof typeof addressErrors]}
            aria-describedby={field.ariaDescribedBy}
            fullWidth
            sxStyles={{
              backgroundColor: theme.palette.custom.dialog.background.accent,
              ...(field.name === 'postalCode' && { maxWidth: '130px' }),
            }}
          />
        </Grid2>
      ))}
    </Grid2>
  );
}
