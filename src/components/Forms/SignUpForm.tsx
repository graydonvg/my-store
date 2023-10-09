'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Link, Grid } from '@mui/material';
import ModalProgressBar from '../ui/Modal/ModalProgressBar';
import FormTitle from './FormTitle';
import { createAuthUserWithEmailAndPassword, createUserDocument } from '@/lib/firebase';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import BlueFormButton from '../ui/Buttons/BlueFormButton';
import CustomTextField from '../ui/InputFields/CustomTextField';

const formFields = [
  { label: 'First Name', name: 'firstName', autoComplete: 'given-name' },
  { label: 'Last Name', name: 'lastName', autoComplete: 'family-name' },
  { label: 'Email Address', name: 'email', autoComplete: 'email' },
  { label: 'Password', name: 'password', type: 'password', autoComplete: 'new-password' },
  { label: 'Confirm Password', name: 'confirmPassword', type: 'password', autoComplete: 'new-password' },
];

const defaultFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignUpForm() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formValues, setFormValues] = useState(defaultFormValues);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (formValues.password !== formValues.confirmPassword) {
      setIsLoading(false);
      console.error('Passwords do not match!');
      return;
    }

    const { email, password } = formValues;
    const displayName = formValues.firstName;
    const userData = {
      displayName,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email,
      isAdmin: false,
    };

    try {
      await createAuthUserWithEmailAndPassword(email, password);
      await createUserDocument(userData);
      dispatch(setCurrentUser(userData));
      setFormValues(defaultFormValues);
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
                value={formValues[field.name as keyof typeof formValues]}
                onChange={handleInputChange}
                autoFocus={field.name === 'firstName'}
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
