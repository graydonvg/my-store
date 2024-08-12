import { Box, Divider } from '@mui/material';
import { ChangeEvent, FormEvent } from 'react';
import ContainedButton from '@/components/ui/buttons/simple/ContainedButton';
import FormHeader from '../FormHeader';
import ContactDetailsFieldsAddressForm from './ContactDetailsFieldsAddressForm';
import DeliveryAddressFieldsAddressForm from './DeliveryAddressFieldsAddressForm';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectIsDialogLoading } from '@/lib/redux/features/dialog/dialogSelectors';

type Props = {
  headerText: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function AddressForm({ headerText, onInputChange, onSubmit }: Props) {
  const isDialogLoading = useAppSelector(selectIsDialogLoading);

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
        <ContactDetailsFieldsAddressForm onInputChange={onInputChange} />
        <Divider flexItem />
        <DeliveryAddressFieldsAddressForm onInputChange={onInputChange} />
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
