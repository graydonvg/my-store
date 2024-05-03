import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, IconButton, Dialog, useTheme } from '@mui/material';
import LoadingBar from '../ui/progress/LoadingBar';
import { ReactNode } from 'react';
import { Close } from '@mui/icons-material';
import { BORDER_RADIUS } from '@/config';
import { closeDialog } from '@/lib/redux/slices/dialogSlice';

type Props = {
  isOpen: boolean;
  children: ReactNode;
};

export default function DialogComponent({ isOpen, children }: Props) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isDialogLoading = useAppSelector((state) => state.dialog.isDialogLoading);

  function close() {
    if (isDialogLoading) return;

    dispatch(closeDialog());
  }

  return (
    <Dialog
      scroll="body"
      open={isOpen}
      onClose={close}
      sx={{
        '& .MuiPaper-root': {
          margin: 2,
          maxWidth: 'none !important',
        },
      }}>
      <Box
        sx={{
          margin: '0 auto',
          maxWidth: 400,
          borderRadius: BORDER_RADIUS,
          backgroundColor: theme.palette.custom.dialog.background.primary,
        }}>
        <LoadingBar
          isLoading={isDialogLoading}
          style={{ borderTopRightRadius: BORDER_RADIUS, borderTopLeftRadius: BORDER_RADIUS }}
        />
        <IconButton
          disableRipple
          size="small"
          aria-label="close dialog"
          onClick={close}
          sx={{ color: theme.palette.text.secondary, borderRadius: '4px', position: 'absolute', right: 0, top: 0 }}>
          <Close fontSize="medium" />
        </IconButton>
        {children}
      </Box>
    </Dialog>
  );
}
