'use client';

import { Box, Typography } from '@mui/material';
import CustomTextField from '../../ui/inputFields/CustomTextField';
import { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { UpdateAddressTypeStore } from '@/types';
import NumberField from '../../ui/inputFields/NumberField';

const deliveryAddressFormFields = [
  {
    label: 'Complex / Building',
    name: 'complexOrBuilding',
    placeholder: 'Name, unit number or floor',
    required: false,
  },
  { label: 'Street address', name: 'streetAddress', placeholder: 'e.g. 14 Christiaan Barnard Street', required: true },
  { label: 'Suburb', name: 'suburb', placeholder: 'e.g. Foreshore', required: true },
  { label: 'Province', name: 'province', placeholder: 'e.g. Western Cape', required: true },
  { label: 'City', name: 'city', placeholder: 'e.g. Cape Town', required: true },
  { label: 'Postal Code', name: 'postalCode', placeholder: 'e.g. 8000', required: true },
];

type Props = {
  addressFormData: UpdateAddressTypeStore;
  submitAddressOnEnterKeyDown: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function AddressFormDeliveryAddressFields({
  addressFormData,
  submitAddressOnEnterKeyDown,
  onInputChange,
}: Props) {
  function handleOnEnterKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter') {
      submitAddressOnEnterKeyDown;
    }
  }

  function getInputField(field: { label: string; name: string; placeholder: string; required: boolean }) {
    if (field.name === 'postalCode') {
      return (
        <NumberField
          key={field.name}
          label={field.label}
          name={field.name}
          value={addressFormData[field.name as keyof typeof addressFormData]}
          placeholder={field.placeholder ?? ''}
          required={field.required}
          fullWidth={false}
          margin="normal"
          styles={{ maxWidth: '130px' }}
          onChange={onInputChange}
          onKeyDown={(event) => handleOnEnterKeyDown(event)}
        />
      );
    } else {
      return (
        <CustomTextField
          key={field.name}
          label={field.label}
          name={field.name}
          value={addressFormData[field.name as keyof typeof addressFormData]}
          placeholder={field.placeholder ?? ''}
          required={field.required}
          fullWidth={true}
          margin="normal"
          onChange={onInputChange}
          onKeyDown={(event) => handleOnEnterKeyDown(event)}
        />
      );
    }
  }

  return (
    <Box>
      <Typography fontSize={18}>Delivery Address</Typography>
      {deliveryAddressFormFields.map((field) => getInputField(field))}
    </Box>
  );
}
