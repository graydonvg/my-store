import { ListItemButton, ListItemText } from '@mui/material';
import NavDrawerOptionIcon from './NavDrawerOptionIcon';

type Props = {
  path: string;
  label: string;
};

export default function NavDrawerOptionButtonNoLink({ label }: Props) {
  return (
    <ListItemButton sx={{ width: 1, height: '100%' }}>
      <ListItemText
        primary={label}
        sx={{ color: (theme) => theme.palette.custom.navbar.lower.text }}
      />
      <NavDrawerOptionIcon label={label} />
    </ListItemButton>
  );
}
