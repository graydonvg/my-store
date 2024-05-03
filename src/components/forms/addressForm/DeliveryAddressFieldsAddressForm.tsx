import { Grid, Typography, useTheme } from '@mui/material';
import CustomTextField from '../../ui/inputFields/CustomTextField';
import { ChangeEvent } from 'react';
import { AddressTypeStore } from '@/types';
import NumberField from '../../ui/inputFields/NumberField';

type Props = {
  addressFormData: AddressTypeStore;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function DeliveryAddressFieldsAddressForm({ addressFormData, onInputChange }: Props) {
  const theme = useTheme();
  return (
    <Grid
      container
      spacing={2}>
      <Grid
        item
        xs={12}>
        <Typography fontSize={18}>Delivery Address</Typography>
      </Grid>
      <Grid
        item
        xs={12}>
        <CustomTextField
          label="Complex / Building"
          name="complexOrBuilding"
          value={addressFormData.complexOrBuilding}
          placeholder="Name, unit number or floor"
          required={false}
          fullWidth={true}
          onChange={onInputChange}
          hasValue={addressFormData.complexOrBuilding !== '' && addressFormData.complexOrBuilding?.length !== null}
          backgroundColor={theme.palette.custom.dialog.background.accent}
        />
      </Grid>
      <Grid
        item
        xs={12}>
        <CustomTextField
          label="Street address"
          name="streetAddress"
          value={addressFormData.streetAddress}
          placeholder="e.g. 24 Kingfisher Walk"
          required={true}
          fullWidth={true}
          onChange={onInputChange}
          hasValue={addressFormData.streetAddress.length > 0}
          backgroundColor={theme.palette.custom.dialog.background.accent}
        />
      </Grid>
      <Grid
        item
        xs={12}>
        <CustomTextField
          label="Suburb"
          name="suburb"
          value={addressFormData.suburb}
          placeholder="e.g. Pinelands"
          required={true}
          fullWidth={true}
          onChange={onInputChange}
          hasValue={addressFormData.suburb.length > 0}
          backgroundColor={theme.palette.custom.dialog.background.accent}
        />
      </Grid>
      <Grid
        item
        xs={12}>
        <CustomTextField
          label="Province"
          name="province"
          value={addressFormData.province}
          placeholder="e.g. Western Cape"
          required={true}
          fullWidth={true}
          onChange={onInputChange}
          hasValue={addressFormData.province.length > 0}
          backgroundColor={theme.palette.custom.dialog.background.accent}
        />
      </Grid>
      <Grid
        item
        xs={12}>
        <CustomTextField
          label="City"
          name="city"
          value={addressFormData.city}
          placeholder="e.g. Cape Town"
          required={true}
          fullWidth={true}
          onChange={onInputChange}
          hasValue={addressFormData.city.length > 0}
          backgroundColor={theme.palette.custom.dialog.background.accent}
        />
      </Grid>
      <Grid
        item
        xs={12}>
        <NumberField
          label="Postal Code"
          name="postalCode"
          value={addressFormData.postalCode}
          placeholder="e.g. 7405"
          required={true}
          fullWidth={false}
          styles={{ maxWidth: '130px' }}
          onChange={onInputChange}
          hasValue={addressFormData.postalCode !== ''}
          backgroundColor={theme.palette.custom.dialog.background.accent}
        />
      </Grid>
    </Grid>
  );
}
