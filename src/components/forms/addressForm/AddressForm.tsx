import { Box, Divider } from '@mui/material';
import { ChangeEvent, FormEvent } from 'react';
import { Add } from '@mui/icons-material';
import { AddressTypeStore } from '@/types';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import FormHeader from '../FormHeader';
import ContactDetailsFieldsAddressForm from './ContactDetailsFieldsAddressForm';
import DeliveryAddressFieldsAddressForm from './DeliveryAddressFieldsAddressForm';

type Props = {
  addressFormData: AddressTypeStore;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isDialogLoading: boolean;
};

export default function AddressForm({ addressFormData, onInputChange, onSubmit, isDialogLoading }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        paddingBottom: 3,
      }}>
      <FormHeader text={'Add Address'} />
      <Box
        component="form"
        onSubmit={onSubmit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSubmit;
          }
        }}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, paddingX: 3 }}>
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
          label={'add'}
          disabled={isDialogLoading}
          type="submit"
          fullWidth
          color="primary"
          startIcon={!addressFormData.addressId && !isDialogLoading ? <Add /> : null}
        />
      </Box>
    </Box>
  );
}
