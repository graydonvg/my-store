import { Box, Divider } from '@mui/material';
import FormHeading from '../FormHeading';
import ContainedButton from '../../ui/buttons/ContainedButton';
import { ChangeEvent, FormEvent } from 'react';
import { Add } from '@mui/icons-material';
import { addNewAddress } from '@/services/users/add';
import { InsertAddressType, UpdateAddressTypeDb, UpdateAddressTypeStore } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { setIsDialogLoading } from '@/lib/redux/slices/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { setAddressFormDataOnChange } from '@/lib/redux/slices/addressFormSlice';
import { updateAddress } from '@/services/users/update';
import ContactDetailsFieldsAddressForm from './ContactDetailsFieldsAddressForm';
import DeliveryAddressFieldsAddressForm from './DeliveryAddressFieldsAddressForm';

export default function AddressForm() {
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
        <FormHeading text={addressFormData.addressId ? 'Edit Address' : 'Add Address'} />
      </Box>
      <Box
        component="form"
        onSubmit={!addressFormData.addressId ? handleAddNewAddress : handleUpdateAddress}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <ContactDetailsFieldsAddressForm
          addressFormData={addressFormData}
          submitAddressOnEnterKeyDown={!addressFormData.addressId ? handleAddNewAddress : handleUpdateAddress}
          onInputChange={handleInputChange}
        />
        <Divider />
        <DeliveryAddressFieldsAddressForm
          addressFormData={addressFormData}
          submitAddressOnEnterKeyDown={!addressFormData.addressId ? handleAddNewAddress : handleUpdateAddress}
          onInputChange={handleInputChange}
        />
        <ContainedButton
          label={addressFormData.addressId ? 'save' : 'add'}
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
