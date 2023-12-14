'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { Box, useTheme, IconButton, Dialog } from '@mui/material';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import LoadingBar from './progress/LoadingBar';
import { ReactNode } from 'react';
import { closeDialog } from '@/lib/redux/dialog/dialogSlice';
import { Close } from '@mui/icons-material';

type Props = {
  isOpen: boolean;
  children: ReactNode;
};

export default function DialogComponent({ isOpen, children }: Props) {
  const dispatch = useAppDispatch();
  const showDialogLoadingBar = useAppSelector((state) => state.dialog.showDialogLoadingBar);
  const theme = useTheme();
  const customColorPalette = useCustomColorPalette();
  const mode = theme.palette.mode;
  const dialogBackgroundColor = mode === 'light' ? customColorPalette.grey.light : customColorPalette.grey.dark;

  function handleCloseDialog() {
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
          maxWidth: 'none',
        },
      }}>
      <Box
        sx={{
          margin: '0 auto',
          maxWidth: 400,
          boxShadow: 24,
          borderRadius: '4px',
          backgroundColor: dialogBackgroundColor,
        }}>
        <LoadingBar
          isLoading={showDialogLoadingBar}
          style={{ borderTopRightRadius: '4px', borderTopLeftRadius: '4px' }}
        />
        <Box sx={{ position: 'absolute', right: 4, top: 4 }}>
          <IconButton
            size="small"
            aria-label="close dialog"
            onClick={handleCloseDialog}>
            <Close fontSize="medium" />
          </IconButton>
        </Box>
        <Box sx={{ padding: 4 }}>{children}</Box>
      </Box>
    </Dialog>
  );
}
