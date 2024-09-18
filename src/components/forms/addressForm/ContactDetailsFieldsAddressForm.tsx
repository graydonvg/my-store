import { Grid2, Typography, useTheme } from '@mui/material';
import CustomTextField from '../../ui/inputFields/CustomTextField';
import { AddressStore } from '@/types';
import { ChangeEvent, useEffect } from 'react';
import { Call, Person } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectAddressFromData } from '@/lib/redux/features/addressForm/addressFormSelectors';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { setAddressFormData } from '@/lib/redux/features/addressForm/addressFormSlice';

const contactDetailsFormFields = [
  { label: 'First Name', name: 'recipientFirstName', placeholder: 'e.g. John', required: true, icon: <Person /> },
  { label: 'Last Name', name: 'recipientLastName', placeholder: 'e.g. Doe', required: true, icon: <Person /> },
  {
    label: 'Contact Number',
    name: 'recipientContactNumber',
    placeholder: 'e.g. 0721234567',
    required: true,
    icon: <Call />,
  },
];

type Props = {
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function ContactDetailsFieldsAddressForm({ onInputChange }: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const addressFormData = useAppSelector(selectAddressFromData);
  const userData = useAppSelector(selectUserData);

  useEffect(() => {
    dispatch(
      setAddressFormData({
        recipientFirstName: userData?.firstName ?? '',
        recipientLastName: userData?.lastName ?? '',
        recipientContactNumber: userData?.contactNumber ?? '',
      })
    );
  }, [dispatch, userData]);

  return (
    <Grid2
      container
      spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Typography fontSize={18}>Contact Details</Typography>
      </Grid2>
      {contactDetailsFormFields.map((field) => (
        <Grid2
          size={{ xs: 12 }}
          key={field.name}>
          <CustomTextField
            key={field.name}
            label={field.label}
            name={field.name}
            value={addressFormData[field.name as keyof AddressStore]}
            placeholder={field.placeholder ?? ''}
            autoFocus={field.name === 'recipientFirstName'}
            required={field.required}
            fullWidth={true}
            onChange={onInputChange}
            icon={field.icon}
            hasValue={
              addressFormData[field.name as keyof AddressStore] !== '' &&
              addressFormData[field.name as keyof AddressStore] !== null
            }
            backgroundColor={theme.palette.custom.dialog.background.accent}
          />
        </Grid2>
      ))}
    </Grid2>
  );
}
