'use client';

import { Box, Divider, Typography } from '@mui/material';
import FormTitle from './FormTitle';
import CustomTextField from '../ui/inputFields/CustomTextField';
import ContainedButton from '../ui/buttons/ContainedButton';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Add } from '@mui/icons-material';
import { addNewAddress } from '@/services/users/add-address';
import { InsertAddressType, UpdateAddressTypeDb, UpdateAddressTypeStore } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import NumberField from '../ui/inputFields/NumberField';
import { setIsAddressDialogOpen, setShowDialogLoadingBar } from '@/lib/redux/dialog/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { clearAddressFormData, setAddressFormDataOnChange } from '@/lib/redux/addressForm/addressFormSlice';
import { updateAddress } from '@/services/users/update-address';
import { setUserData } from '@/lib/redux/user/userSlice';

const contactDetailsFormFields = [
  { name: 'recipientFirstName', label: 'First Name', type: 'text', placeholder: 'e.g. John' },
  { name: 'recipientLastName', label: 'Last Name', type: 'text', placeholder: 'e.g. Doe' },
  { name: 'recipientContactNumber', label: 'Contact Number', type: 'text', placeholder: 'e.g. 0721234567' },
];

const deliveryAddressFormFields = [
  {
    name: 'complexOrBuilding',
    label: 'Complex / Building',
    type: 'text',
    placeholder: 'Name, unit number or floor',
  },
  { name: 'streetAddress', label: 'Street address', type: 'text', placeholder: 'e.g. 14 Christiaan Barnard Street' },
  { name: 'suburb', label: 'Suburb', type: 'text', placeholder: 'e.g. Foreshore' },
  { name: 'province', label: 'Province', type: 'text', placeholder: 'e.g. Western Cape' },
  { name: 'city', label: 'City', type: 'text', placeholder: 'e.g. Cape Town' },
  { name: 'postalCode', label: 'Postal Code', type: 'number', placeholder: 'e.g. 8000' },
];

export default function AddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.user.userData);
  const [isLoading, setIsLoading] = useState(false);
  const addressFormData = useAppSelector((state) => state.addressForm);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === 'postalCode' && value.length > 4) return;

    dispatch(setAddressFormDataOnChange({ field: name as keyof UpdateAddressTypeStore, value }));
  }

  async function handleAddNewAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { addressId, postalCode, ...restOfAddressData } = addressFormData;

    // if (formData.postal_code.length < 4) return toast.error('Min. 4 characters required');

    dispatch(setShowDialogLoadingBar(true));
    setIsLoading(true);

    const { success, message } = await addNewAddress({
      ...restOfAddressData,
      postalCode: Number(postalCode),
      userId: userData?.userId!,
    } as InsertAddressType);

    if (success === true) {
      dispatch(
        setUserData({
          ...userData!,
          addresses: [
            ...userData?.addresses!,
            {
              ...restOfAddressData,
              postalCode: Number(postalCode),
              userId: userData?.userId!,
              complexOrBuilding: restOfAddressData.complexOrBuilding ?? null,
              addressId: '',
              createdAt: '',
            },
          ],
        })
      );

      dispatch(setIsAddressDialogOpen(false));
      dispatch(clearAddressFormData());
      toast.success(message);
    } else {
      toast.error(message);
    }

    router.refresh();
    dispatch(setShowDialogLoadingBar(false));
    setIsLoading(false);
  }

  async function handleUpdateAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // if (formData.postal_code.length < 4) return toast.error('Min. 4 characters required');

    dispatch(setShowDialogLoadingBar(true));

    const { success, message } = await updateAddress({
      ...addressFormData,
      postalCode: Number(addressFormData.postalCode),
    } as UpdateAddressTypeDb);

    if (success === true) {
      const updatedAddresses = userData?.addresses.map((address) =>
        address.addressId === addressFormData.addressId
          ? {
              ...addressFormData,
              postalCode: Number(addressFormData.postalCode),
              complexOrBuilding: addressFormData.complexOrBuilding,
              addressId: addressFormData.addressId!,
              userId: address.userId,
              createdAt: address.createdAt,
            }
          : address
      );

      dispatch(
        setUserData({
          ...userData!,
          addresses: updatedAddresses!,
        })
      );
      dispatch(setIsAddressDialogOpen(false));
      dispatch(clearAddressFormData());
      toast.success(message);
    } else {
      toast.error(message);
    }

    router.refresh();
    dispatch(setShowDialogLoadingBar(false));
    setIsLoading(false);
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
        <Box>
          <Typography fontSize={18}>Contact Details</Typography>
          {contactDetailsFormFields.map((field) => (
            <CustomTextField
              key={field.name}
              margin="normal"
              required={true}
              fullWidth={true}
              id={field.name}
              label={field.label}
              name={field.name}
              type={field.type}
              value={addressFormData[field.name as keyof typeof addressFormData]}
              onChange={handleInputChange}
              placeholder={field.placeholder ?? ''}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleAddNewAddress;
                }
              }}
            />
          ))}
        </Box>
        <Divider />
        <Box>
          <Typography fontSize={18}>Delivery Address</Typography>
          {deliveryAddressFormFields.map((field) => {
            return field.type === 'number' ? (
              <NumberField
                key={field.name}
                margin="normal"
                required={true}
                fullWidth={false}
                id={field.name}
                label={field.label}
                name={field.name}
                value={addressFormData[field.name as keyof typeof addressFormData]}
                onChange={handleInputChange}
                placeholder={field.placeholder ?? ''}
                styles={{ maxWidth: '130px' }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleAddNewAddress;
                  }
                }}
              />
            ) : (
              <CustomTextField
                key={field.name}
                margin="normal"
                required={field.name !== 'complexOrBuilding' ? true : false}
                fullWidth={true}
                id={field.name}
                label={field.label}
                name={field.name}
                value={addressFormData[field.name as keyof typeof addressFormData]}
                onChange={handleInputChange}
                placeholder={field.placeholder ?? ''}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handleAddNewAddress;
                  }
                }}
              />
            );
          })}
        </Box>
        <ContainedButton
          label={addressFormData.addressId ? 'save' : 'add'}
          isDisabled={isLoading}
          type="submit"
          fullWidth
          backgroundColor="blue"
          startIcon={!addressFormData.addressId && !isLoading ? <Add /> : null}
        />
      </Box>
    </Box>
  );
}
