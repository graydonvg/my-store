'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Divider, Link, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import ModalProgressBar from '../ui/Modal/ModalProgressBar';
import FormTitle from './FormTitle';
import { signInWithGooglePopup, signInAuthUserWithEmailAndPassword, createUserDocument } from '@/lib/firebase';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import BlueFormButton from '../ui/Buttons/BlueFormButton';
import CustomTextField from '../ui/CustomTextField';

const defaultFormFields = {
  email: '',
  password: '',
};

export default function SignInForm() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState(defaultFormFields);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormFields((prevFormFields) => ({ ...prevFormFields, [name]: value }));
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await signInAuthUserWithEmailAndPassword(formFields.email, formFields.password);
      setFormFields(defaultFormFields);
      dispatch(setIsModalOpen(false));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogleAndCreateUser() {
    setIsLoading(true);

    try {
      const { user } = await signInWithGooglePopup();
      const { displayName, email } = user;
      const userDisplayName = displayName?.split(' ')[0];

      await createUserDocument({ displayName: userDisplayName, email });
      dispatch(
        setCurrentUser({
          displayName: userDisplayName ?? '',
          email: email ?? '',
          isAdmin: false,
        })
      );
      dispatch(setIsModalOpen(false));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function openSignUpModal() {
    dispatch(setIsModalOpen(false));
    setTimeout(() => dispatch(setModalContent('signUp')), 300);
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
      <FormTitle text="Sign in" />
      <Box
        component="form"
        onSubmit={handleSignIn}
        sx={{ mt: 1 }}>
        {[
          { name: 'email', label: 'Email Address', type: 'email', autoComplete: 'email' },
          { name: 'password', label: 'Password', type: 'password', autoComplete: 'current-password' },
        ].map((field) => (
          <CustomTextField
            key={field.name}
            margin="normal"
            required={true}
            fullWidth={true}
            id={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            value={formFields[field.name as keyof typeof formFields]}
            onChange={handleInputChange}
            autoFocus={field.name === 'email'}
          />
        ))}
        <BlueFormButton
          label="sign in"
          disabled={isLoading}
          type="submit"
          sx={{ mt: 3, mb: 2 }}
          fullWidth={true}
        />
        <Divider>
          <Typography
            component="span"
            variant="caption">
            OR
          </Typography>
        </Divider>
        <BlueFormButton
          onClick={signInWithGoogleAndCreateUser}
          label="sign with google"
          disabled={isLoading}
          type="button"
          sx={{ mt: 2, mb: 3 }}
          fullWidth={true}
          startIcon={<GoogleIcon />}
        />
        <Link
          onClick={openSignUpModal}
          sx={{ cursor: 'pointer' }}
          component="p"
          variant="body2">
          Don&apos;t have an account? Sign Up
        </Link>
      </Box>
    </Box>
  );
}
