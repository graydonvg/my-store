import { Grid2, Typography, useTheme } from '@mui/material';
import CustomTextField from '../../ui/CustomTextField';
import { ChangeEvent } from 'react';
import { Call, Person } from '@mui/icons-material';
import { InsertAddress, UpdateAddress } from '@/types';

const fieldConfigs = [
  {
    label: 'First name',
    id: 'recipient-first-name',
    name: 'recipientFirstName',
    autoComplete: 'given-name',
    placeholder: 'e.g. John',
    icon: <Person />,
    ariaDescribedBy: 'recipient-first-name-helper-text',
  },
  {
    label: 'Last name',
    id: 'recipient-last-name',
    name: 'recipientLastName',
    autoComplete: 'family-name',
    placeholder: 'e.g. Doe',
    icon: <Person />,
    ariaDescribedBy: 'recipient-last-name-helper-text',
  },
  {
    label: 'Contact number',
    id: 'recipient-contact-number',
    name: 'recipientContactNumber',
    type: 'tel',
    autoComplete: 'tel',
    placeholder: 'e.g. 0721234567',
    icon: <Call />,
    ariaDescribedBy: 'recipient-contact-number-helper-text',
  },
];

type Props = {
  contactDetails: Partial<InsertAddress> | Partial<UpdateAddress>;
  contactFormErrors: {
    recipientFirstNameError?: string | null;
    recipientLastNameError?: string | null;
    recipientContactNumberError?: string | null;
  };
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function ContactDetailsFieldsAddressForm({ contactDetails, contactFormErrors, onChange }: Props) {
  const theme = useTheme();

  return (
    <Grid2
      container
      spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Typography fontSize={18}>Contact Details</Typography>
      </Grid2>
      {fieldConfigs.map((field) => (
        <Grid2
          size={{ xs: 12 }}
          key={field.name}>
          <CustomTextField
            label={field.label}
            id={field.id}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            autoFocus={field.name === 'recipientFirstName'}
            value={contactDetails[field.name as keyof typeof contactDetails]}
            onChange={onChange}
            icon={field.icon}
            aria-invalid={!!contactFormErrors[`${field.name}Error` as keyof typeof contactFormErrors]}
            error={!!contactFormErrors[`${field.name}Error` as keyof typeof contactFormErrors]}
            helperText={contactFormErrors[`${field.name}Error` as keyof typeof contactFormErrors]}
            aria-describedby={field.ariaDescribedBy}
            sxStyles={{ backgroundColor: theme.palette.custom.dialog.background.accent }}
            hasValue={
              contactDetails[field.name as keyof typeof contactDetails] !== '' &&
              contactDetails[field.name as keyof typeof contactDetails] !== null
            }
            fullWidth
            required
          />
        </Grid2>
      ))}
    </Grid2>
  );
}
