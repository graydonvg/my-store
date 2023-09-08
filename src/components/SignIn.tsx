'use client';

import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { signInWithGooglePopup } from '@/lib/firebase';

export default function SignIn() {
  const dispatch = useAppDispatch();
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  function goToSignUp() {
    dispatch(setIsModalOpen(false));
    setTimeout(() => dispatch(setModalContent('signUp')), 300);
    setTimeout(() => dispatch(setIsModalOpen(true)), 500);
  }

  async function signInWithGoogle() {
    setIsLoadingUser(true);
    try {
      await signInWithGooglePopup();
      dispatch(setIsModalOpen(false));
    } catch (error) {
      console.log(error);
      if (error) {
        console.log(error);
        setIsModalOpen(true);
      }
    }
    setIsLoadingUser(false);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Avatar sx={{ m: 1 }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography
        component="h2"
        variant="h5">
        Sign in
      </Typography>
      <Button
        onClick={signInWithGoogle}
        disabled={isLoadingUser}
        type="button"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 1, display: 'flex' }}>
        <GoogleIcon />
        <Typography
          component="p"
          variant="button"
          sx={{ flexGrow: 1, marginRight: '24px' }}>
          Sign with Google
        </Typography>
      </Button>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
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
        />
        <FormControlLabel
          control={
            <Checkbox
              value="remember"
              color="primary"
            />
          }
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}>
          Sign In
        </Button>
        <Link
          onClick={goToSignUp}
          sx={{ cursor: 'pointer' }}
          component="p"
          variant="body2">
          Don&apos;t have an account? Sign Up
        </Link>
      </Box>
    </Box>
  );
}
