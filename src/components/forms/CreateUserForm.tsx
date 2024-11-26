'use client';

import { ReactNode } from 'react';
import { Box, Grid2, useTheme } from '@mui/material';
import FormHeader from './FormHeader';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import CustomTextField from '../ui/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Person, Call, Email, Lock, AdminPanelSettings } from '@mui/icons-material';

import {
  PasswordSchema,
  UserAuthDataSchema,
  UserPersonalInfoSchema,
  UserRoleSelectOptions,
  UserRoleSelectOptionsSchema,
} from '@/types';
import { createNewUser } from '@/services/admin/add';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { z } from 'zod';
import useForm from '@/hooks/use-form';
import { USER_ROLE_OPTIONS } from '@/constants';

function getFieldConfigs(selectOptions: UserRoleSelectOptions[]) {
  return [
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
    {
      label: 'Role',
      id: 'role',
      name: 'role',
      type: 'password',
      icon: <AdminPanelSettings />,
      ariaDescribedBy: 'role-helper-text',
      required: true,
      selectOptions,
    },
  ];
}

const CreateUserFormSchema = UserAuthDataSchema.merge(UserPersonalInfoSchema).merge(
  z.object({ confirmPassword: PasswordSchema, role: UserRoleSelectOptionsSchema })
);

const defaultFormData = {
  firstName: '',
  lastName: '',
  email: '',
  contactNumber: '',
  password: '',
  confirmPassword: '',
  role: '' as 'none',
};

type Props = {
  children: ReactNode;
};

export default function CreateUserForm({ children }: Props) {
  const form = useForm(CreateUserFormSchema, defaultFormData);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const restricedUserRoleOptions = USER_ROLE_OPTIONS.filter((role) => {
    if (userData?.role === 'admin') {
      return role === 'none';
    } else if (userData?.role === 'manager') {
      return role === 'none' || role === 'admin';
    } else {
      return role;
    }
  });
  const fieldConfigs = getFieldConfigs(restricedUserRoleOptions);

  async function handleCreateUser() {
    dispatch(setIsDialogLoading(true));

    const { confirmPassword, role, ...restOfFormData } = form.values;
    const selectedRole = role === 'none' ? null : role;

    const { success, message } = await createNewUser({ ...restOfFormData, role: selectedRole });

    if (success) {
      toast.success(message);
      dispatch(closeDialog());
      form.reset();
      router.refresh();
    } else {
      toast.error(message);
    }

    dispatch(setIsDialogLoading(false));
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
      }}>
      <FormHeader
        text="Create a new user"
        headerComponent="h2"
      />
      <Box
        component="form"
        noValidate
        onSubmit={form.handleSubmit(handleCreateUser)}
        sx={{ paddingX: 2 }}>
        <Grid2
          container
          spacing={2}>
          {fieldConfigs.map((field) => (
            <Grid2
              size={{ xs: 12, sm: field.name === 'firstName' || field.name === 'lastName' ? 6 : false }}
              key={field.name}>
              <CustomTextField
                label={field.label}
                id={field.id}
                name={field.name}
                type={field.type}
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
                select={!!field.selectOptions}
                selectOptions={field.selectOptions}
              />
            </Grid2>
          ))}
        </Grid2>
        {children}
      </Box>
    </Box>
  );
}
