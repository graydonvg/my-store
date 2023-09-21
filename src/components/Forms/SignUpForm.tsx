'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Button, TextField, Link, Grid } from '@mui/material';
import ModalProgressBar from '../ui/Modal/ModalProgressBar';
import FormTitle from './FormTitle';
import { createAuthUserWithEmailAndPassword, createUserDocument } from '@/lib/firebase';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { formTextFieldStyles, formButtonStyles } from './styles';

const defaultFromFields = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function SignUpForm() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState(defaultFromFields);
  const displayName = formFields.firstName;
  const userData = {
    displayName,
    firstName: formFields.firstName,
    lastName: formFields.lastName,
    email: formFields.email,
    isAdmin: false,
  };

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (formFields.password !== formFields.confirmPassword) {
      setIsLoading(false);
      console.error('Passwords do not match!');
      return;
    }

    createAndSaveUser();
  }

  async function createAndSaveUser() {
    try {
      await createAuthUserWithEmailAndPassword(formFields.email, formFields.password);
      await createUserDocument(userData);
      dispatch(setCurrentUser(userData));
      setFormFields(defaultFromFields);
      dispatch(setIsModalOpen(false));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      dispatch(setIsModalOpen(false));
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
        sx={{ mt: 1 }}>
        <Grid
          container
          spacing={2}>
          <Grid
            item
            xs={12}
            sm={6}>
            <TextField
              sx={formTextFieldStyles}
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              value={formFields.firstName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}>
            <TextField
              sx={formTextFieldStyles}
              fullWidth
              id="lastName"
              required
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={formFields.lastName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid
            item
            xs={12}>
            <TextField
              sx={formTextFieldStyles}
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formFields.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid
            item
            xs={12}>
            <TextField
              sx={formTextFieldStyles}
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formFields.password}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid
            item
            xs={12}>
            <TextField
              sx={formTextFieldStyles}
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              autoComplete="new-password"
              value={formFields.confirmPassword}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          disabled={isLoading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, ...formButtonStyles }}>
          Sign Up
        </Button>
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
