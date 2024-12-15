'use client';

import { useState, ReactNode } from 'react';
import { Box, Grid2, useTheme } from '@mui/material';
import FormHeader from './FormHeader';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import ContainedButton from '../ui/buttons/ContainedButton';
import CustomTextField from '../ui/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import signUpNewUser from '@/services/auth/sign-up';
import { Call, Email, Lock, Person } from '@mui/icons-material';
import { selectIsSignInDialogOpen } from '@/lib/redux/features/dialog/dialogSelectors';
import { PasswordSchema, UserAuthDataSchema, UserPersonalInfoSchema } from '@/types';
import useForm from '@/hooks/use-form';
import { z } from 'zod';
import SignInAsAdminButton from '../SignInAsAdminButton';

const fieldConfigs = [
  {
    label: 'First name',
    id: 'first-name',
    name: 'firstName',
    autoComplete: 'given-name',
    icon: <Person />,
    ariaDescribedBy: 'first-name-helper-text',
    required: false,
  },
  {
    label: 'Last name',
    id: 'last-name',
    name: 'lastName',
    autoComplete: 'family-name',
    icon: <Person />,
    ariaDescribedBy: 'last-name-helper-text',
    required: false,
  },
  {
    label: 'Contact number',
    id: 'contact-number',
    name: 'contactNumber',
    type: 'tel',
    autoComplete: 'tel',
    icon: <Call />,
    ariaDescribedBy: 'contact-number-helper-text',
    required: false,
  },
  {
    label: 'Email',
    id: 'email',
    name: 'email',
    type: 'email',
    autoComplete: 'email',
    icon: <Email />,
    ariaDescribedBy: 'email-helper-text',
    required: true,
  },
  {
    label: 'Password',
    id: 'password',
    name: 'password',
    type: 'password',
    autoComplete: 'new-password',
    icon: <Lock />,
    ariaDescribedBy: 'password-helper-text',
    required: true,
  },
  {
    label: 'Confirm password',
    id: 'confirm-password',
    name: 'confirmPassword',
    type: 'password',
    autoComplete: 'new-password',
    icon: <Lock />,
    ariaDescribedBy: 'confirm-password-helper-text',
    required: true,
  },
];

const SignUpSchema = UserAuthDataSchema.merge(UserPersonalInfoSchema).merge(
  z.object({ confirmPassword: PasswordSchema })
);

const defaultFormData = {
  firstName: '',
  lastName: '',
  contactNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const defaultLoadingStates = {
  signUp: false,
  signInAsAdmin: false,
};

type Props = {
  headerComponent: 'h1' | 'h2';
  children: ReactNode;
};

export default function SignUpForm({ headerComponent, children }: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isSignUpDialogOpen = useAppSelector(selectIsSignInDialogOpen);
  const form = useForm(SignUpSchema, defaultFormData, {
    checkEquality: [{ fields: ['password', 'confirmPassword'], message: 'Passwords do not match' }],
  });
  const [isLoading, setIsLoading] = useState(defaultLoadingStates);
  const disableButtons = isLoading.signUp || isLoading.signInAsAdmin;

  async function handleSignUp() {
    setIsLoading((prev) => ({ ...prev, signUp: true }));

    if (isSignUpDialogOpen) {
      dispatch(setIsDialogLoading(true));
    }

    const { confirmPassword, ...restOfFormData } = form.values;

    const { success, message } = await signUpNewUser({ ...restOfFormData });

    if (success === true) {
      dispatch(closeDialog());
      form.reset();
      router.refresh();
    } else {
      toast.error(message);
    }

    setIsLoading((prev) => ({ ...prev, signUp: false }));

    if (isSignUpDialogOpen) {
      dispatch(setIsDialogLoading(false));
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 3,
        paddingBottom: 3,
      }}>
      <FormHeader
        headerComponent={headerComponent}
        text="Sign up"
      />
      <Box
        component="form"
        noValidate
        onSubmit={form.handleSubmit(handleSignUp)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingX: 2 }}>
        <Grid2
          container
          spacing={2}>
          {fieldConfigs.map((field) => (
            <Grid2
              key={field.id}
              size={{ xs: 12, sm: field.name === 'firstName' || field.name === 'lastName' ? 6 : false }}>
              <CustomTextField
                label={field.label}
                id={field.id}
                name={field.name}
                type={field.type || 'text'}
                autoComplete={field.autoComplete}
                value={form.values[field.name as keyof typeof form.values]}
                onChange={form.handleChange}
                hasValue={!!form.values[field.name as keyof typeof form.values]}
                fullWidth
                required={field.required}
                icon={field.icon}
                aria-invalid={!!form.errors[field.name as keyof typeof form.errors]}
                error={!!form.errors[field.name as keyof typeof form.errors]}
                helperText={form.errors[field.name as keyof typeof form.errors]}
                aria-describedby={field.ariaDescribedBy}
                sxStyles={{ backgroundColor: theme.palette.custom.dialog.background.accent }}
              />
            </Grid2>
          ))}
        </Grid2>
        <ContainedButton
          label={!isSignUpDialogOpen && isLoading.signUp ? '' : 'sign up'}
          disabled={disableButtons}
          isLoading={!isSignUpDialogOpen && isLoading.signUp}
          type="submit"
          fullWidth
          color="primary"
        />
        {children}
        <SignInAsAdminButton
          isLoading={!isSignUpDialogOpen && isLoading.signInAsAdmin}
          isDisabled={disableButtons}
          setIsLoading={() => setIsLoading((prev) => ({ ...prev, signInAsAdmin: !prev.signInAsAdmin }))}
        />
      </Box>
    </Box>
  );
}
