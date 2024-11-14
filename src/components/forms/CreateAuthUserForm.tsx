'use client';

import { useState, ChangeEvent, FormEvent, ReactNode } from 'react';
import { Box, Grid2, useTheme } from '@mui/material';
import FormHeader from './FormHeader';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeDialog, setIsDialogLoading } from '@/lib/redux/features/dialog/dialogSlice';
import CustomTextField from '../ui/CustomTextField';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Person, Call, Email, Lock, AdminPanelSettings } from '@mui/icons-material';
import { CONSTANTS } from '@/constants';
import { UserAuthDataSchema, UserPersonalInfoSchema, UserRole } from '@/types';
import { createNewUser } from '@/services/admin/add';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import { useLogger } from 'next-axiom';

const formFields = [
  {
    label: 'First Name',
    name: 'firstName',
    type: 'text',
    autoComplete: 'given-name',
    required: false,
    icon: <Person />,
  },
  {
    label: 'Last Name',
    name: 'lastName',
    type: 'text',
    autoComplete: 'family-name',
    required: false,
    icon: <Person />,
  },
  { label: 'Contact number', name: 'contactNumber', type: 'tel', required: false, icon: <Call /> },
  {
    label: 'Email Address',
    name: 'email',
    type: 'text',
    autoComplete: 'email',
    required: true,
    icon: <Email />,
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    autoComplete: 'new-password',
    required: true,
    icon: <Lock />,
  },
  {
    label: 'Confirm Password',
    name: 'confirmPassword',
    type: 'password',
    autoComplete: 'new-password',
    required: true,
    icon: <Lock />,
  },
];

const defaultFormData = {
  firstName: '',
  lastName: '',
  email: '',
  contactNumber: '',
  password: '',
  confirmPassword: '',
  role: '',
};

type Props = {
  children: ReactNode;
};

export default function CreateAuthUserForm({ children }: Props) {
  const log = useLogger();
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const [formData, setFormData] = useState(defaultFormData);
  const restricedUserRoleOptions = CONSTANTS.USER_ROLE_OPTIONS.filter((role) => {
    if (userData?.role === 'admin') {
      return role === 'none';
    } else if (userData?.role === 'manager') {
      return role === 'none' || role === 'admin';
    } else {
      return role;
    }
  });

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function handleCreateAuthUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    dispatch(setIsDialogLoading(true));

    const { confirmPassword, password, role, ...restOfFormData } = formData;

    const validation = UserAuthDataSchema.merge(UserPersonalInfoSchema).safeParse({ password, ...restOfFormData });

    if (!validation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, {
        payload: restOfFormData,
        error: validation.error,
      });

      const errorMessage = constructZodErrorMessage(validation.error);

      toast.error(errorMessage);
      return;
    }

    const { success, message } = await createNewUser({
      password,
      ...restOfFormData,
      role: role === 'none' ? null : (role as UserRole),
    });

    if (success) {
      toast.success(message);
      dispatch(closeDialog());
      setFormData(defaultFormData);
    } else {
      toast.error(message);
    }

    router.refresh();
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
        onSubmit={handleCreateAuthUser}
        sx={{ paddingX: 2 }}>
        <Grid2
          container
          spacing={2}>
          {formFields.map((field) => (
            <Grid2
              size={{ xs: 12, sm: field.name === 'firstName' || field.name === 'lastName' ? 6 : false }}
              key={field.name}>
              <CustomTextField
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name as keyof typeof formData]}
                autoComplete={field.autoComplete}
                autoFocus={field.name === 'firstName'}
                required={field.required}
                fullWidth={true}
                onChange={handleInputChange}
                icon={field.icon}
                hasValue={formData[field.name as keyof typeof formData].length > 0}
                sxStyles={{ backgroundColor: theme.palette.custom.dialog.background.accent }}
              />
            </Grid2>
          ))}
          <Grid2 size={{ xs: 12 }}>
            {/* <FormControl fullWidth> */}
            <CustomTextField
              select
              label="Role"
              name="role"
              selectOptions={restricedUserRoleOptions}
              value={formData.role}
              fullWidth
              required
              onChange={handleInputChange}
              icon={<AdminPanelSettings />}
              hasValue={formData.role.length > 0}
              sxStyles={{ backgroundColor: theme.palette.custom.dialog.background.accent }}
            />
            {/* </FormControl> */}
          </Grid2>
        </Grid2>
        {children}
      </Box>
    </Box>
  );
}
