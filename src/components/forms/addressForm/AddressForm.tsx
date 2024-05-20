import { Box, Divider } from '@mui/material';
import { ChangeEvent, FormEvent } from 'react';
import { AddressStore } from '@/types';
import ContainedButton from '@/components/ui/buttons/simple/ContainedButton';
import FormHeader from '../FormHeader';
import ContactDetailsFieldsAddressForm from './ContactDetailsFieldsAddressForm';
import DeliveryAddressFieldsAddressForm from './DeliveryAddressFieldsAddressForm';

type Props = {
  headerText: string;
  addressFormData: AddressStore;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isDialogLoading: boolean;
};

export default function AddressForm({ headerText, addressFormData, onInputChange, onSubmit, isDialogLoading }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        paddingBottom: 3,
      }}>
      <FormHeader
        text={headerText}
        headerComponent="h2"
      />
      <Box
        component="form"
        onSubmit={onSubmit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSubmit;
          }
        }}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, paddingX: 2 }}>
        <ContactDetailsFieldsAddressForm
          addressFormData={addressFormData}
          onInputChange={onInputChange}
        />
        <Divider flexItem />
        <DeliveryAddressFieldsAddressForm
          addressFormData={addressFormData}
          onInputChange={onInputChange}
        />
        <ContainedButton
          label="save"
          disabled={isDialogLoading}
          type="submit"
          fullWidth
          color="secondary"
        />
      </Box>
    </Box>
  );
}
