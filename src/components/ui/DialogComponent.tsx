import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, IconButton, Dialog, useTheme, LinearProgress, dialogClasses } from '@mui/material';
import { ReactNode } from 'react';
import { Close } from '@mui/icons-material';

import { closeDialog } from '@/lib/redux/features/dialog/dialogSlice';
import { selectIsDialogLoading } from '@/lib/redux/features/dialog/dialogSelectors';
import { BORDER_RADIUS } from '@/constants';

type Props = {
  isOpen: boolean;
  children: ReactNode;
};

export default function DialogComponent({ isOpen, children }: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isDialogLoading = useAppSelector(selectIsDialogLoading);

  function handleCloseDialog() {
    if (isDialogLoading) return;

    dispatch(closeDialog());
  }

  return (
    <Dialog
      scroll="body"
      open={isOpen}
      onClose={handleCloseDialog}
      sx={{
        [`& .${dialogClasses.paper}`]: { margin: 2, maxWidth: 'none !important' },
      }}>
      <Box
        sx={{
          margin: '0 auto',
          maxWidth: 400,
          borderRadius: BORDER_RADIUS,
          backgroundColor: theme.palette.custom.dialog.background.primary,
        }}>
        {isDialogLoading ? <LinearProgress /> : null}
        <IconButton
          disableRipple
          size="small"
          aria-label="close dialog"
          onClick={handleCloseDialog}
          sx={{ color: theme.palette.text.secondary, borderRadius: '4px', position: 'absolute', right: 6, top: 6 }}>
          <Close fontSize="medium" />
        </IconButton>
        {children}
      </Box>
    </Dialog>
  );
}
