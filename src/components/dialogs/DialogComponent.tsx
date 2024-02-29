import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, IconButton, Dialog } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
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
  const dispatch = useAppDispatch();
  const colorPalette = useColorPalette();
  const isDialogLoading = useAppSelector((state) => state.dialog.isDialogLoading);

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
        '& .MuiPaper-root': {
          margin: 2,
          maxWidth: 'none !important',
        },
      }}>
      <Box
        sx={{
          margin: '0 auto',
          maxWidth: 400,
          boxShadow: 24,
          borderRadius: BORDER_RADIUS,
          backgroundColor: colorPalette.dialog.background,
        }}>
        <LoadingBar
          isLoading={isDialogLoading}
          style={{ borderTopRightRadius: BORDER_RADIUS, borderTopLeftRadius: BORDER_RADIUS }}
        />
        <Box sx={{ position: 'absolute', right: 3, top: 3 }}>
          <IconButton
            disableRipple
            size="small"
            aria-label="close dialog"
            onClick={handleCloseDialog}
            sx={{ color: colorPalette.typography }}>
            <Close fontSize="large" />
          </IconButton>
        </Box>
        <Box sx={{ padding: 4, paddingTop: 6 }}>{children}</Box>
      </Box>
    </Dialog>
  );
}
