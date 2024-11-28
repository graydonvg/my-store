import { Box, Divider } from '@mui/material';
import { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import ContainedButton from '@/components/ui/buttons/ContainedButton';
import FormHeader from '../FormHeader';
import ContactDetailsFieldsAddressForm from './ContactDetailsFieldsAddressForm';
import DeliveryAddressFieldsAddressForm from './DeliveryAddressFieldsAddressForm';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectIsDialogLoading } from '@/lib/redux/features/dialog/dialogSelectors';
import { InsertAddress, UpdateAddress } from '@/types';

type FormValues = InsertAddress | UpdateAddress;

type Props = {
  headerText: string;
  formValues: FormValues;
  formErrors: {
    [key in keyof FormValues]?: string | null;
  };
  onSubmit: (e: FormEvent<Element>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function AddressForm({ headerText, formValues, formErrors, onChange, onSubmit }: Props) {
  const isDialogLoading = useAppSelector(selectIsDialogLoading);
  const { recipientFirstName, recipientLastName, recipientContactNumber, ...addressData } = formValues;
  const {
    recipientFirstName: recipientFirstNameError,
    recipientLastName: recipientLastNameError,
    recipientContactNumber: recipientContactNumberError,
    ...addressErrors
  } = formErrors;
  const contactDetails = { recipientFirstName, recipientLastName, recipientContactNumber };
  const contactFormErrors = { recipientFirstNameError, recipientLastNameError, recipientContactNumberError };

  function handleOnKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Enter') {
      onSubmit;
    }
  }

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
        noValidate
        onSubmit={onSubmit}
        onKeyDown={handleOnKeyDown}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3, paddingX: 2 }}>
        <ContactDetailsFieldsAddressForm
          contactDetails={contactDetails}
          contactFormErrors={contactFormErrors}
          onChange={onChange}
        />
        <Divider flexItem />
        <DeliveryAddressFieldsAddressForm
          addressData={addressData}
          addressErrors={addressErrors}
          onChange={onChange}
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
