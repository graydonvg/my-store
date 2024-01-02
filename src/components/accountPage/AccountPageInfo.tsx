import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ReactNode } from 'react';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';

type UserDataWithLabelProps = {
  label: string;
  children: ReactNode;
};

function UserDataWithLabel({ label, children }: UserDataWithLabelProps) {
  const customColorPalette = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const labelColor =
    mode === 'dark' ? customColorPalette.white.opacity.strong : customColorPalette.black.opacity.strong;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', paddingBottom: 2 }}>
      <Typography
        component="label"
        fontSize={12}
        sx={{ color: labelColor }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

type EditableFieldProps = {
  showEditableField: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
};

function EditableField({ showEditableField, label, onClick, children }: EditableFieldProps) {
  if (!showEditableField) return null;

  return (
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
      <UserDataWithLabel label={label}>{children}</UserDataWithLabel>
      <EditIcon />
    </Box>
  );
}

type NonEditableFieldProps = {
  showNonEditableField: boolean;
  label: string;
  children: ReactNode;
};

function NonEditableField({ showNonEditableField, label, children }: NonEditableFieldProps) {
  if (!showNonEditableField) return null;

  return <UserDataWithLabel label={label}>{children}</UserDataWithLabel>;
}

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

type AccountPageInfoProps = EditableProps | NonEditableProps;

export default function AccountPageInfo({ canEdit, label, onClick, children }: AccountPageInfoProps) {
  return (
    <>
      <EditableField
        showEditableField={canEdit}
        label={label}
        onClick={onClick!}>
        {children}
      </EditableField>
      <NonEditableField
        showNonEditableField={!canEdit}
        label={label}>
        {children}
      </NonEditableField>
    </>
  );
}
