'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Link, Grid } from '@mui/material';
import ModalProgressBar from '../ui/modal/ModalProgressBar';
import FormTitle from './FormTitle';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import CustomButton from '../ui/buttons/CustomButton';
import CustomTextField from '../ui/inputFields/CustomTextField';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { toast } from 'react-toastify';
import signUpNewUserWithPassword from '@/services/sign-up';
import updateUser from '@/services/update-user';

const formFields = [
  { label: 'First Name', name: 'firstName', autoComplete: 'given-name' },
  { label: 'Last Name', name: 'lastName', autoComplete: 'family-name' },
  { label: 'Email Address', name: 'email', autoComplete: 'email' },
  { label: 'Password', name: 'password', type: 'password', autoComplete: 'new-password' },
  { label: 'Confirm Password', name: 'confirmPassword', type: 'password', autoComplete: 'new-password' },
];

const defaultFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignUpForm() {
  const dispatch = useAppDispatch();
  const color = useCustomColorPalette();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState(defaultFormData);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      toast.error('Passwords do not match.');
      return;
    }

    const { email, password } = formData;
    const user_name = formData.firstName;

    try {
      const signUpResponse = await signUpNewUserWithPassword({ email, password });

      if (signUpResponse.status === 200) {
        const id = signUpResponse.userId!;
        const updateResponse = await updateUser({
          id,
          user_name,
          first_name: formData.firstName,
          last_name: formData.lastName,
        });

        if (updateResponse.status === 200) {
          setFormData(defaultFormData);
          dispatch(setIsModalOpen(false));
        } else {
          toast.error(`Update user failed. ${updateResponse.statusText}.`);
        }
      } else {
        toast.error(`Sign up failed. ${signUpResponse.statusText}.`);
      }
    } catch (error) {
      toast.error('Sign up failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  function openSignInModal() {
    dispatch(setIsModalOpen(false));
    setTimeout(() => dispatch(setModalContent('signIn')), 300);
    setTimeout(() => dispatch(setIsModalOpen(true)), 500);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <ModalProgressBar isLoading={isLoading} />
      <FormTitle text="Sign up" />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3 }}>
        <Grid
          container
          spacing={2}>
          {formFields.map((field) => (
            <Grid
              item
              xs={12}
              sm={field.name === 'firstName' || field.name === 'lastName' ? 6 : false}
              key={field.name}>
              <CustomTextField
                required={true}
                fullWidth={true}
                id={field.name}
                label={field.label}
                name={field.name}
                type={field.type || 'text'}
                autoComplete={field.autoComplete}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                autoFocus={field.name === 'firstName'}
              />
            </Grid>
          ))}
        </Grid>
        <CustomButton
          label="sign up"
          disabled={isLoading}
          type="submit"
          styles={{ mt: 3, mb: 2, backgroundColor: color.blue.dark, '&:hover': { backgroundColor: color.blue.light } }}
          fullWidth={true}
        />
        <Link
          onClick={openSignInModal}
          sx={{ cursor: 'pointer' }}
          component="p"
          variant="body2">
          Already have an account? Sign in
        </Link>
      </Box>
    </Box>
  );
}
