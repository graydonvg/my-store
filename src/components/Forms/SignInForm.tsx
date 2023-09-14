'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { Avatar, Button, TextField, Box, Typography, Link, LinearProgress, Divider } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { signInAuthUserWithEmailAndPassword, signInWithGooglePopup } from '@/lib/firebase';
import ModalProgressBar from '../ui/ModalProgressBar';
import FormTitle from './FormTitle';

const defaultFromFields = {
  email: '',
  password: '',
};

export default function SignInForm() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formFields, setFormFields] = useState(defaultFromFields);

  async function signInWithGoogle() {
    setIsLoading(true);
    try {
      await signInWithGooglePopup();
      dispatch(setIsModalOpen(false));
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  }

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
      setIsLoading(false);
      dispatch(setIsModalOpen(false));
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
    dispatch(setIsModalOpen(false));
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
          sx={{ mt: 3, mb: 2 }}>
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
          sx={{ mt: 2, mb: 3, display: 'flex' }}>
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
