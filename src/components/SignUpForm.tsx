import { ChangeEvent, FormEvent, useState } from 'react';
import { Avatar, Button, TextField, Link, Grid, Box, Typography, LinearProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAppDispatch } from '@/lib/redux/hooks';
import { setIsModalOpen, setModalContent } from '@/lib/redux/modal/modalSlice';
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth, updateUserProfile } from '@/lib/firebase';
import { setCurrentUser } from '@/lib/redux/user/userSlice';
import { CurrentUserType } from '@/types';

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
  const displayName = `${formFields.firstName} ${formFields.lastName}`;

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (formFields.password !== formFields.confirmPassword) {
      setIsLoading(false);
      return console.error('Passwords do not match!');
    }

    try {
      await createAuthUserWithEmailAndPassword(formFields.email, formFields.password);
      await createUserDocumentFromAuth({ displayName });
      const user = await updateUserProfile(displayName);
      const selectedUserDetails = user && (({ displayName, email }) => ({ displayName, email }))(user);
      dispatch(setCurrentUser(selectedUserDetails as CurrentUserType));
      setFormFields(defaultFromFields);
      dispatch(setIsModalOpen(false));
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
    dispatch(setIsModalOpen(false));
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
      <Box sx={{ height: '4px', width: 1, mb: 2 }}>{isLoading ? <LinearProgress sx={{ width: 1 }} /> : null}</Box>
      <Avatar sx={{ m: 1 }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography
        component="h2"
        variant="h5">
        Sign up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 3 }}>
        <Grid
          container
          spacing={2}>
          <Grid
            item
            xs={12}
            sm={6}>
            <TextField
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
              required
              fullWidth
              id="lastName"
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
          sx={{ mt: 3, mb: 2 }}>
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
