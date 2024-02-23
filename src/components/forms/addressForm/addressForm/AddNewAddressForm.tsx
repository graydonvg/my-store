import { Box, Divider } from '@mui/material';
import { ChangeEvent, FormEvent } from 'react';
import { Add } from '@mui/icons-material';
import { addNewAddress } from '@/services/users/add';
import { InsertAddressType, UpdateAddressTypeStore } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDialogLoading } from '@/lib/redux/slices/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { setAddressFormDataOnChange } from '@/lib/redux/slices/addressFormSlice';
import FormHeading from '../../FormHeading';
import ContactDetailsFieldsAddressForm from '../ContactDetailsFieldsAddressForm';
import DeliveryAddressFieldsAddressForm from '../DeliveryAddressFieldsAddressForm';
import ContainedButton from '@/components/ui/buttons/ContainedButton';

export default function AddNewAddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.userData);
  const addressFormData = useAppSelector((state) => state.addressForm);
  const isDialogLoading = useAppSelector((state) => state.dialog.isDialogLoading);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === 'postalCode' && value.length > 4) return;

    dispatch(setAddressFormDataOnChange({ field: name as keyof UpdateAddressTypeStore, value }));
  }

  async function handleAddNewAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { addressId, postalCode, ...restOfAddressData } = addressFormData;

    dispatch(setIsDialogLoading(true));

    const { success, message } = await addNewAddress({
      ...restOfAddressData,
      postalCode: Number(postalCode),
      userId: userData?.userId!,
    } as InsertAddressType);

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
        <FormHeading text={'Add Address'} />
      </Box>
      <Box
        component="form"
        onSubmit={handleAddNewAddress}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleAddNewAddress;
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
          label={'add'}
          disabled={isDialogLoading}
          type="submit"
          fullWidth
          backgroundColor="primary"
          startIcon={!addressFormData.addressId && !isDialogLoading ? <Add /> : null}
        />
      </Box>
    </Box>
  );
}
