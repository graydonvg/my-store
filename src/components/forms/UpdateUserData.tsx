'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Typography } from '@mui/material';
import FormTitle from './FormTitle';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setShowModalLoadingBar } from '@/lib/redux/modal/modalSlice';
import CustomButton from '../ui/buttons/CustomButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import updateUser from '@/services/update-user';

const formFields = [
  { label: 'First Name', name: 'firstName', autoComplete: 'given-name' },
  { label: 'Last Name', name: 'lastName', autoComplete: 'family-name' },
];

const defaultFormData = {
  firstName: '',
  lastName: '',
};

export default function UpdateUserData() {
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();
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

    try {
      const response = await updateUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
      });

      if (response.statusCode === 200) {
        setFormData(defaultFormData);
        dispatch(setIsModalOpen(false));
      } else {
        toast.error(`Update user failed. ${response.message}.`);
      }
    } catch (error) {
      toast.error('Update user failed. Please try again later.');
    } finally {
      dispatch(setShowModalLoadingBar(false));
      setIsLoading(false);
      router.refresh();
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
        <CustomButton
          label="submit"
          disabled={isLoading}
          type="submit"
          styles={{ marginTop: 3, backgroundColor: color.blue.dark, '&:hover': { backgroundColor: color.blue.light } }}
          fullWidth={true}
        />
      </Box>
    </Box>
  );
}
