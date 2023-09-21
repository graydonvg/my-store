'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Box, Button, Divider, Link, TextField, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import ModalProgressBar from '../ui/Modal/ModalProgressBar';
import FormTitle from './FormTitle';
import { signInWithGooglePopup, signInAuthUserWithEmailAndPassword, createUserDocument } from '@/lib/firebase';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { formTextFieldStyles, formButtonStyles } from './styles';

const defaultFromFields = {
  email: '',
  password: '',
};

export default function SignInForm() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState(defaultFromFields);

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  }

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await signInAuthUserWithEmailAndPassword(formFields.email, formFields.password);
      setFormFields(defaultFromFields);
      dispatch(setIsModalOpen(false));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle() {
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
        <TextField
          sx={formTextFieldStyles}
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formFields.email}
          onChange={handleInputChange}
          autoFocus
        />
        <TextField
          sx={formTextFieldStyles}
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formFields.password}
          onChange={handleInputChange}
        />
        <Button
          disabled={isLoading}
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            ...formButtonStyles,
          }}>
          Sign In
        </Button>
        <Divider>
          <Typography
            component="span"
            variant="caption">
            OR
          </Typography>
        </Divider>
        <Button
          onClick={signInWithGoogle}
          disabled={isLoading}
          type="button"
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 3, display: 'flex', ...formButtonStyles }}>
          <GoogleIcon />
          <Typography
            component="p"
            variant="button"
            sx={{ flexGrow: 1, marginRight: '24px' }}>
            Sign with Google
          </Typography>
        </Button>
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
