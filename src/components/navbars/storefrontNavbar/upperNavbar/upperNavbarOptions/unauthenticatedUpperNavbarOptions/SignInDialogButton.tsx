'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { useTheme } from '@mui/material';
import TextButton from '@/components/ui/buttons/TextButton';

export default function SignInDialogButton() {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  function openSignInDialog() {
    dispatch(openDialog('signInDialog'));
  }

  return (
    <TextButton
      label="sign in"
      onClick={openSignInDialog}
      sxStyles={{
        width: { xs: '60px', md: '100px' },
        minWidth: 'unset',
        paddingX: { xs: 0, md: 1 },
        color: theme.palette.custom.navbar.upper.text,
        height: { xs: 'auto', md: 1 },
        minHeight: 'unset',
      }}
    />
  );
}
