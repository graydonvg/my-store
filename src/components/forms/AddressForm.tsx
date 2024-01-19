'use client';

import { Box, Divider, Typography } from '@mui/material';
import FormTitle from './FormTitle';
import CustomTextField from '../ui/inputFields/CustomTextField';
import ContainedButton from '../ui/buttons/ContainedButton';
import { ChangeEvent, FormEvent } from 'react';
import { Add } from '@mui/icons-material';
import { addNewAddress } from '@/services/users/add';
import { InsertAddressType, UpdateAddressTypeDb, UpdateAddressTypeStore } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import NumberField from '../ui/inputFields/NumberField';
import { setIsDialogLoading } from '@/lib/redux/dialog/dialogSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { setAddressFormDataOnChange } from '@/lib/redux/addressForm/addressFormSlice';
import { updateAddress } from '@/services/users/update';

const contactDetailsFormFields = [
  { label: 'First Name', name: 'recipientFirstName', type: 'text', placeholder: 'e.g. John' },
  { label: 'Last Name', name: 'recipientLastName', type: 'text', placeholder: 'e.g. Doe' },
  { label: 'Contact Number', name: 'recipientContactNumber', type: 'text', placeholder: 'e.g. 0721234567' },
];

const deliveryAddressFormFields = [
  {
    label: 'Complex / Building',
    name: 'complexOrBuilding',
    type: 'text',
    placeholder: 'Name, unit number or floor',
  },
  { label: 'Street address', name: 'streetAddress', type: 'text', placeholder: 'e.g. 14 Christiaan Barnard Street' },
  { label: 'Suburb', name: 'suburb', type: 'text', placeholder: 'e.g. Foreshore' },
  { label: 'Province', name: 'province', type: 'text', placeholder: 'e.g. Western Cape' },
  { label: 'City', name: 'city', type: 'text', placeholder: 'e.g. Cape Town' },
  { label: 'Postal Code', name: 'postalCode', type: 'number', placeholder: 'e.g. 8000' },
];

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

    // if (postalCode.length < 4) return toast.error('Min. 4 characters required');

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

    // if (formData.postal_code.length < 4) return toast.error('Min. 4 characters required');

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
