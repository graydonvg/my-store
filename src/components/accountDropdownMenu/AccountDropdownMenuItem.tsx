import { BORDER_RADIUS } from '@/config';
import { ListItemIcon, MenuItem, useTheme } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  label: ReactNode;
  onClick?: () => void;
};

export default function AccountDropdownMenuItem({ icon, label, onClick }: Props) {
  const theme = useTheme();

  return (
    <MenuItem
      sx={{
        borderRadius: BORDER_RADIUS,
        color: theme.palette.custom.navbar.upper.text,
        '&:hover': { backgroundColor: theme.palette.primary.main },
      }}
      onClick={onClick}>
      <ListItemIcon sx={{ color: theme.palette.custom.navbar.upper.text }}>{icon}</ListItemIcon>
      {label}
    </MenuItem>
  );
}
