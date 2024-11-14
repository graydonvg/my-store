'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { useTheme } from '@mui/material';
import TextButton from '@/components/ui/buttons/TextButton';

export default function SignUpDialogButton() {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  function openSignUpDialog() {
    dispatch(openDialog('signUpDialog'));
  }

  return (
    <TextButton
      label="sign up"
      onClick={openSignUpDialog}
      sxStyles={{ width: '100px', color: theme.palette.custom.navbar.upper.text, height: 1, minHeight: 'unset' }}
    />
  );
}
