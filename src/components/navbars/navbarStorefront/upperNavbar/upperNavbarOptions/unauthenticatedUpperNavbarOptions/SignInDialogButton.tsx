'use client';

import { useAppDispatch } from '@/lib/redux/hooks';
import { openDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { useTheme } from '@mui/material';
import TextButton from '@/components/ui/buttons/simple/TextButton';

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
        width: { xs: 'fit-content', md: '100px' },
        minWidth: 'unset',
        paddingX: { xs: 0, md: 1 },
        color: theme.palette.custom.navbar.upper.text,
        height: { xs: 'auto', md: 1 },
      }}
    />
  );
}
