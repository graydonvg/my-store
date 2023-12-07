'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Typography } from '@mui/material';
import FormTitle from './FormTitle';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsUpdateModalOpen, setShowModalLoadingBar } from '@/lib/redux/modal/modalSlice';
import ContainedButton from '../ui/buttons/ContainedButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { updateUserPersonalInformation } from '@/services/users/update-user';

const formFields = [
  { label: 'First Name', name: 'first_name', autoComplete: 'given-name' },
  { label: 'Last Name', name: 'last_name', autoComplete: 'family-name' },
];

const defaultFormData = {
  first_name: '',
  last_name: '',
};

export default function UpdateUserData() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(defaultFormData);
  const router = useRouter();

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormValues) => ({ ...prevFormValues, [name]: value }));
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    dispatch(setShowModalLoadingBar(true));

    const { first_name, last_name } = formData;

    try {
      const { success, message } = await updateUserPersonalInformation({ first_name, last_name, contact_number: null });

      if (success) {
        dispatch(setIsUpdateModalOpen(false));
        setFormData(defaultFormData);
        router.refresh();
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error('Update user failed. Please try again later.');
    } finally {
      setIsLoading(false);
      dispatch(setShowModalLoadingBar(false));
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}>
      <FormTitle text="Welcome!" />
      <Typography
        component="p"
        variant="body1">
        Please provide the following details
      </Typography>
      <Box
        component="form"
        onSubmit={handleUpdate}>
        {formFields.map((field) => (
          <CustomTextField
            key={field.name}
            margin="normal"
            required={true}
            fullWidth={true}
            id={field.name}
            label={field.label}
            name={field.name}
            autoComplete={field.autoComplete}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleInputChange}
            autoFocus={field.name === 'email'}
          />
        ))}
        <ContainedButton
          label="submit"
          isDisabled={isLoading}
          type="submit"
          styles={{ marginTop: 3 }}
          fullWidth
          backgroundColor="blue"
        />
      </Box>
    </Box>
  );
}
