import { Box, Typography } from '@mui/material';
import CustomTextField from '../../ui/inputFields/CustomTextField';
import { UpdateAddressTypeStore } from '@/types';
import { ChangeEvent, FormEvent } from 'react';

const contactDetailsFormFields = [
  { label: 'First Name', name: 'recipientFirstName', placeholder: 'e.g. John', required: true },
  { label: 'Last Name', name: 'recipientLastName', placeholder: 'e.g. Doe', required: true },
  { label: 'Contact Number', name: 'recipientContactNumber', placeholder: 'e.g. 0721234567', required: true },
];

type Props = {
  addressFormData: UpdateAddressTypeStore;
  submitAddressOnEnterKeyDown: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function ContactDetailsFieldsAddressForm({
  submitAddressOnEnterKeyDown,
  addressFormData,
  onInputChange,
}: Props) {
  return (
    <Box>
      <Typography fontSize={18}>Contact Details</Typography>
      {contactDetailsFormFields.map((field) => (
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
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              submitAddressOnEnterKeyDown;
            }
          }}
        />
      ))}
    </Box>
  );
}
