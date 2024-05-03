import { Grid, Typography, useTheme } from '@mui/material';
import CustomTextField from '../../ui/inputFields/CustomTextField';
import { AddressTypeStore } from '@/types';
import { ChangeEvent } from 'react';
import { Call, Person } from '@mui/icons-material';

const contactDetailsFormFields = [
  { label: 'First Name', name: 'recipientFirstName', placeholder: 'e.g. John', required: true, icon: <Person /> },
  { label: 'Last Name', name: 'recipientLastName', placeholder: 'e.g. Doe', required: true, icon: <Person /> },
  {
    label: 'Contact Number',
    name: 'recipientContactNumber',
    placeholder: 'e.g. 0721234567',
    required: true,
    icon: <Call />,
  },
];

type Props = {
  addressFormData: AddressTypeStore;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function ContactDetailsFieldsAddressForm({ addressFormData, onInputChange }: Props) {
  const theme = useTheme();

  return (
    <Grid
      container
      spacing={2}>
      <Grid
        item
        xs={12}>
        <Typography fontSize={18}>Contact Details</Typography>
      </Grid>
      {contactDetailsFormFields.map((field) => (
        <Grid
          item
          xs={12}
          key={field.name}>
          <CustomTextField
            key={field.name}
            label={field.label}
            name={field.name}
            value={addressFormData[field.name as keyof AddressTypeStore]}
            placeholder={field.placeholder ?? ''}
            required={field.required}
            fullWidth={true}
            onChange={onInputChange}
            icon={field.icon}
            hasValue={
              addressFormData[field.name as keyof AddressTypeStore] !== '' &&
              addressFormData[field.name as keyof AddressTypeStore] !== null
            }
            backgroundColor={theme.palette.custom.dialog.background.accent}
          />
        </Grid>
      ))}
    </Grid>
  );
}
