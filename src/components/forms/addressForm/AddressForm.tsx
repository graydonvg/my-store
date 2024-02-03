'use client';

import { Box, Divider, Typography } from '@mui/material';
import FormTitle from '../FormTitle';
import CustomTextField from '../../ui/inputFields/CustomTextField';
import ContainedButton from '../../ui/buttons/ContainedButton';
import { ChangeEvent, FormEvent } from 'react';
import { Add } from '@mui/icons-material';
import { addNewAddress } from '@/services/users/add';
import { InsertAddressType, UpdateAddressTypeDb, UpdateAddressTypeStore } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import NumberField from '../../ui/inputFields/NumberField';
import { setIsDialogLoading } from '@/lib/redux/dialog/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { setAddressFormDataOnChange } from '@/lib/redux/addressForm/addressFormSlice';
import { updateAddress } from '@/services/users/update';
import AddressFormContactDetailsFields from './AddressFormContactDetailsFields';
import AddressFormDeliveryAddressFields from './AddressFormDeliveryAddressFields';

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
        <FormTitle text={addressFormData.addressId ? 'Edit Address' : 'Add Address'} />
      </Box>
      <Box
        component="form"
        onSubmit={!addressFormData.addressId ? handleAddNewAddress : handleUpdateAddress}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <AddressFormContactDetailsFields
          addressFormData={addressFormData}
          submitAddressOnEnterKeyDown={!addressFormData.addressId ? handleAddNewAddress : handleUpdateAddress}
          onInputChange={handleInputChange}
        />
        <Divider />
        <AddressFormDeliveryAddressFields
          addressFormData={addressFormData}
          submitAddressOnEnterKeyDown={!addressFormData.addressId ? handleAddNewAddress : handleUpdateAddress}
          onInputChange={handleInputChange}
        />
        <ContainedButton
          label={addressFormData.addressId ? 'save' : 'add'}
          disabled={isDialogLoading}
          type="submit"
          fullWidth
          backgroundColor="blue"
          startIcon={!addressFormData.addressId && !isDialogLoading ? <Add /> : null}
        />
      </Box>
    </Box>
  );
}
