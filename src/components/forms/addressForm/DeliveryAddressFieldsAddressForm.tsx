import { Box, Typography } from '@mui/material';
import CustomTextField from '../../ui/inputFields/CustomTextField';
import { ChangeEvent } from 'react';
import { UpdateAddressTypeStore } from '@/types';
import NumberField from '../../ui/inputFields/NumberField';

type Props = {
  addressFormData: UpdateAddressTypeStore;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function DeliveryAddressFieldsAddressForm({ addressFormData, onInputChange }: Props) {
  return (
    <Box>
      <Typography fontSize={18}>Delivery Address</Typography>
      <CustomTextField
        label="Complex / Building"
        name="complexOrBuilding"
        value={addressFormData['complexOrBuilding']}
        placeholder="Name, unit number or floor"
        required={false}
        fullWidth={true}
        margin="normal"
        onChange={onInputChange}
      />
      <CustomTextField
        label="Street address"
        name="streetAddress"
        value={addressFormData['streetAddress']}
        placeholder="e.g. 24 Kingfisher Walk"
        required={true}
        fullWidth={true}
        margin="normal"
        onChange={onInputChange}
      />
      <CustomTextField
        label="Suburb"
        name="suburb"
        value={addressFormData['suburb']}
        placeholder="e.g. Pinelands"
        required={true}
        fullWidth={true}
        margin="normal"
        onChange={onInputChange}
      />
      <CustomTextField
        label="Province"
        name="province"
        value={addressFormData['province']}
        placeholder="e.g. Western Cape"
        required={true}
        fullWidth={true}
        margin="normal"
        onChange={onInputChange}
      />
      <CustomTextField
        label="City"
        name="city"
        value={addressFormData['city']}
        placeholder="e.g. Cape Town"
        required={true}
        fullWidth={true}
        margin="normal"
        onChange={onInputChange}
      />
      <NumberField
        label="Postal Code"
        name="postalCode"
        value={addressFormData['postalCode']}
        placeholder="e.g. 7405"
        required={true}
        fullWidth={false}
        margin="normal"
        styles={{ maxWidth: '130px' }}
        onChange={onInputChange}
      />
    </Box>
  );
}
