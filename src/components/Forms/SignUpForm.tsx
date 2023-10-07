'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, TextField, Link, Grid, useTheme } from '@mui/material';
import ModalProgressBar from '../ui/Modal/ModalProgressBar';
import FormTitle from './FormTitle';
import { createAuthUserWithEmailAndPassword, createUserDocument } from '@/lib/firebase';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import BlueFormButton from '../ui/Buttons/BlueFormButton';
import CustomTextField from '../ui/CustomTextField';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

const defaultFormFields = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignUpForm() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState(defaultFormFields);
  const theme = useTheme();
  const color = useCustomColorPalette();
  const mode = theme.palette.mode;
  const labelColor = mode === 'dark' ? color.grey.light : color.grey.dark;

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormFields((prevFormFields) => ({
      ...prevFormFields,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (formFields.password !== formFields.confirmPassword) {
      setIsLoading(false);
      console.error('Passwords do not match!');
      return;
    }

    const { email, password } = formFields;
    const displayName = formFields.firstName;
    const userData = {
      displayName,
      firstName: formFields.firstName,
      lastName: formFields.lastName,
      email,
      isAdmin: false,
    };

    try {
      await createAuthUserWithEmailAndPassword(email, password);
      await createUserDocument(userData);
      dispatch(setCurrentUser(userData));
      setFormFields(defaultFormFields);
      dispatch(setIsModalOpen(false));
    } catch (error) {
      console.error(error);
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
          {[
            { label: 'First Name', name: 'firstName', autoComplete: 'given-name' },
            { label: 'Last Name', name: 'lastName', autoComplete: 'family-name' },
            { label: 'Email Address', name: 'email', autoComplete: 'email' },
            { label: 'Password', name: 'password', type: 'password', autoComplete: 'new-password' },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', autoComplete: 'new-password' },
          ].map((field) => (
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
                value={formFields[field.name as keyof typeof formFields]}
                onChange={handleInputChange}
                autoFocus={field.name === 'firstName'}
                focusedLabelColor={labelColor}
              />
            </Grid>
          ))}
        </Grid>
        <BlueFormButton
          label="sign up"
          disabled={isLoading}
          type="submit"
          sx={{ mt: 3, mb: 2 }}
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
