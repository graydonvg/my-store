import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ReactNode } from 'react';

type Props = {
  onClick?: () => void;
  label: string;
  children: ReactNode;
};

export default function UserDataAccountPage({ label, onClick, children }: Props) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        alignItems: 'center',
        paddingBottom: 2,
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', paddingBottom: 2 }}>
        <Typography
          component="span"
          fontSize={12}
          color={(theme) => theme.palette.custom.textField.label}>
          {label}
        </Typography>
        <Typography
          component="span"
          fontSize={16}>
          {children}
        </Typography>
      </Box>
      {!!onClick ? <EditIcon /> : null}
    </Box>
  );
}
