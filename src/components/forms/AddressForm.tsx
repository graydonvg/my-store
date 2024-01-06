'use client';

import { Box, Checkbox, FormControl, FormControlLabel } from '@mui/material';
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
import { setCurrentUser } from '@/lib/redux/user/userSlice';

const formFields = [
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
  const currentUser = useAppSelector((state) => state.user.currentUser);
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

    try {
      const { success, message } = await addNewAddress({
        ...restOfAddressData,
        postalCode: Number(postalCode),
        userId: currentUser?.userId!,
      } as InsertAddressType);

      if (success === true) {
        dispatch(
          setCurrentUser({
            ...currentUser!,
            addresses: [
              ...currentUser?.addresses!,
              {
                ...(restOfAddressData as InsertAddressType),
                postalCode: Number(postalCode),
                userId: currentUser?.userId!,
                complexOrBuilding: restOfAddressData.complexOrBuilding ?? null,
                addressId: '',
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
    } catch (error) {
      toast.error('Failed to add address. Please try again later.');
    } finally {
      router.refresh();
      dispatch(setShowDialogLoadingBar(false));
      setIsLoading(false);
    }
  }

  async function handleUpdateAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // if (formData.postal_code.length < 4) return toast.error('Min. 4 characters required');

    dispatch(setShowDialogLoadingBar(true));

    try {
      const { success, message } = await updateAddress({
        ...addressFormData,
        postal_code: Number(addressFormData.postalCode),
      } as UpdateAddressTypeDb);

      if (success === true) {
        const updatedAddresses = currentUser?.addresses.map((address) =>
          address.addressId === addressFormData.addressId
            ? {
                ...(addressFormData as InsertAddressType),
                complexOrBuilding: addressFormData.complexOrBuilding ?? null,
                addressId: addressFormData.addressId!,
              }
            : address
        );

        dispatch(
          setCurrentUser({
            ...currentUser!,
            addresses: updatedAddresses!,
          })
        );
        dispatch(setIsAddressDialogOpen(false));
        dispatch(clearAddressFormData());
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update address. Please try again later.');
    } finally {
      router.refresh();
      dispatch(setShowDialogLoadingBar(false));
      setIsLoading(false);
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
      <Box sx={{ textAlign: 'center' }}>
        <FormTitle text={addressFormData.addressId ? 'Edit Address' : 'Add Address'} />
      </Box>
      <Box
        component="form"
        onSubmit={!addressFormData.addressId ? handleAddNewAddress : handleUpdateAddress}>
        {formFields.map((field) => {
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
              required={field.name !== 'complex_or_building' ? true : false}
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
          );
        })}
        <ContainedButton
          label={addressFormData.addressId ? 'save' : 'add'}
          isDisabled={isLoading}
          type="submit"
          styles={{
            marginTop: 3,
          }}
          fullWidth
          backgroundColor="blue"
          startIcon={!addressFormData.addressId && !isLoading ? <Add /> : null}
        />
      </Box>
    </Box>
  );
}
