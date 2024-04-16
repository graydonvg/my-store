import { BORDER_RADIUS } from '@/config';
import { ListItemIcon, MenuItem } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  label: ReactNode;
  onClick?: () => void;
};

export default function AccountDropdownMenuItem({ icon, label, onClick }: Props) {
  return (
    <MenuItem
      sx={{
        borderRadius: BORDER_RADIUS,
        color: 'white',
        '&:hover': { backgroundColor: (theme) => theme.palette.custom.primary.dark },
      }}
      onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      {label}
    </MenuItem>
  );
}
