import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ReactNode } from 'react';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

type EditableProps = {
  canEdit: true;
  onClick: () => void;
  label: string;
  children: ReactNode;
};

type NonEditableProps = {
  canEdit: false;
  onClick: null;
  label: string;
  children: ReactNode;
};

type Props = EditableProps | NonEditableProps;

export default function AccountPageInfo({ canEdit, label, onClick, children }: Props) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const labelColor =
    mode === 'dark' ? customColorPalette.white.opacity.strong : customColorPalette.black.opacity.strong;

  return (
    <>
      {canEdit ? (
        <Box
          onClick={onClick}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            cursor: 'pointer',
            alignItems: 'center',
            paddingBottom: 2,
          }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '42px' }}>
            <Typography
              component="label"
              fontSize={12}
              sx={{ color: labelColor, cursor: 'pointer' }}>
              {label}
            </Typography>
            {children}
          </Box>
          <EditIcon />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', paddingBottom: 2 }}>
          <Typography
            component="label"
            fontSize={12}
            sx={{ color: labelColor }}>
            {label}
          </Typography>
          {children}
        </Box>
      )}
    </>
  );
}
