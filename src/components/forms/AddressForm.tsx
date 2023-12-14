'use client';

import { Box } from '@mui/material';
import FormTitle from './FormTitle';
import CustomTextField from '../ui/inputFields/CustomTextField';
import ContainedButton from '../ui/buttons/ContainedButton';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Add } from '@mui/icons-material';
import { addNewAddress } from '@/services/users/add-address';
import { InsertAddressType, UpdateAddressTypeDb, UpdateAddressTypeStore } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import NumberField from '../ui/inputFields/NumberField';
import { setIsAddressDialogOpen } from '@/lib/redux/dialog/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { clearAddressFormData, setAddressFormDataOnChange } from '@/lib/redux/addressForm/addressFormSlice';
import { updateAddress } from '@/services/users/update-address';

const formFields = [
  {
    name: 'complex_or_building',
    label: 'Complex / Building',
    type: 'text',
    placeholder: 'Name, unit number or floor',
  },
  { name: 'street_address', label: 'Street address', type: 'text', placeholder: 'e.g 14 Christiaan Barnard Street' },
  { name: 'suburb', label: 'Suburb', type: 'text', placeholder: 'e.g Foreshore' },
  { name: 'province', label: 'Province', type: 'text', placeholder: 'e.g Western Cape' },
  { name: 'city', label: 'City', type: 'text', placeholder: 'e.g Cape Town' },
  { name: 'postal_code', label: 'Postal Code', type: 'number', placeholder: 'e.g 8000' },
];

export default function AddressForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const addressFormData = useAppSelector((state) => state.addressForm);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (name === 'postal_code' && value.length > 4) return;
    dispatch(setAddressFormDataOnChange({ field: name as keyof UpdateAddressTypeStore, value }));
  }

  async function handleAddNewAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { address_id, postal_code, ...restOfAddressData } = addressFormData;

    // if (formData.postal_code.length < 4) return toast.error('Min. 4 characters required');

    setIsLoading(true);

    try {
      const { success, message } = await addNewAddress({
        ...restOfAddressData,
        postal_code: Number(postal_code),
        user_id: currentUser?.user_id!,
      } as InsertAddressType);

      if (success === true) {
        router.refresh();
        dispatch(setIsAddressDialogOpen(false));
        dispatch(clearAddressFormData());
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to add address. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // if (formData.postal_code.length < 4) return toast.error('Min. 4 characters required');

    setIsLoading(true);

    try {
      const { success, message } = await updateAddress({
        ...addressFormData,
        postal_code: Number(addressFormData.postal_code),
      } as UpdateAddressTypeDb);

      if (success === true) {
        router.refresh();
        dispatch(setIsAddressDialogOpen(false));
        dispatch(clearAddressFormData());
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Failed to update address. Please try again later.');
    } finally {
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
        <FormTitle text={addressFormData.address_id ? 'Edit Address' : 'Add Address'} />
      </Box>
      <Box
        component="form"
        onSubmit={!addressFormData.address_id ? handleAddNewAddress : handleUpdateAddress}>
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
          label={!isLoading ? (addressFormData.address_id ? 'save' : 'add') : ''}
          isDisabled={isLoading}
          isLoading={isLoading}
          type="submit"
          styles={{
            marginTop: 3,
          }}
          fullWidth
          backgroundColor="blue"
          startIcon={!addressFormData.address_id ? <Add /> : null}
        />
      </Box>
    </Box>
  );
}
