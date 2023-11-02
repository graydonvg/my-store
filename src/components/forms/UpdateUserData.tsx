'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Typography } from '@mui/material';
import FormTitle from './FormTitle';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setShowModalLoadingBar } from '@/lib/redux/modal/modalSlice';
import CustomButton from '../ui/buttons/CustomButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import browserClient from '@/lib/supabase-browser';

const formFields = [
  { label: 'First Name', name: 'first_name', autoComplete: 'given-name' },
  { label: 'Last Name', name: 'last_name', autoComplete: 'family-name' },
];

const defaultFormData = {
  first_name: '',
  last_name: '',
};

export default function UpdateUserData() {
  const supabase = browserClient();
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

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { first_name, last_name } = formData;

    try {
      const { error } = await supabase
        .from('users')
        .update({ first_name, last_name })
        .eq('user_id', session?.user.id ?? '');

      if (error) {
        toast.error(`Update user failed. ${error.message}.`);
      } else {
        setFormData(defaultFormData);
        dispatch(setIsModalOpen(false));
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
          styles={{ marginTop: 3 }}
          fullWidth={true}
          backgroundColor="blue"
        />
      </Box>
    </Box>
  );
}
