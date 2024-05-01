import { Box, Divider } from '@mui/material';
import { ChangeEvent, FormEvent } from 'react';
import { Add } from '@mui/icons-material';
import { UpdateAddressTypeDb, UpdateAddressTypeStore } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDialogLoading } from '@/lib/redux/slices/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { setAddressFormDataOnChange } from '@/lib/redux/slices/addressFormSlice';
import { updateAddress } from '@/services/users/update';
import FormHeading from '../../FormHeading';
import ContactDetailsFieldsAddressForm from '../ContactDetailsFieldsAddressForm';
import DeliveryAddressFieldsAddressForm from '../DeliveryAddressFieldsAddressForm';
import ContainedButton from '@/components/ui/buttons/ContainedButton';

export default function UpdateAddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const addressFormData = useAppSelector((state) => state.addressForm);
  const isDialogLoading = useAppSelector((state) => state.dialog.isDialogLoading);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === 'postalCode' && value.length > 4) return;

    dispatch(setAddressFormDataOnChange({ field: name as keyof UpdateAddressTypeStore, value }));
  }

  async function handleUpdateAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    dispatch(setIsDialogLoading(true));

    const { success, message } = await updateAddress({
      ...addressFormData,
      postalCode: Number(addressFormData.postalCode),
    } as UpdateAddressTypeDb);

    if (success === true) {
      router.refresh();
      toast.success(message);
    } else {
      toast.error(message);
      dispatch(setIsDialogLoading(false));
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}>
      <Box sx={{ textAlign: 'center', paddingBottom: 1 }}>
        <FormHeading text={'Edit Address'} />
      </Box>
      <Box
        component="form"
        onSubmit={handleUpdateAddress}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleUpdateAddress;
          }
        }}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <ContactDetailsFieldsAddressForm
          addressFormData={addressFormData}
          onInputChange={handleInputChange}
        />
        <Divider />
        <DeliveryAddressFieldsAddressForm
          addressFormData={addressFormData}
          onInputChange={handleInputChange}
        />
        <ContainedButton
          label={'save'}
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
