import React from 'react';
import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ReactNode } from 'react';

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

export default function AccountInformation({ canEdit, label, onClick, children }: Props) {
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
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              component="label"
              fontSize={12}
              sx={{ color: 'rgba(0, 0, 0, 0.6)', cursor: 'pointer' }}>
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
            sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
            {label}
          </Typography>
          {children}
        </Box>
      )}
    </>
  );
}
