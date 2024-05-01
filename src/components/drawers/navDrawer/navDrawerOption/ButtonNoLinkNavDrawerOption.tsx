import { ListItemButton, ListItemText } from '@mui/material';
import IconNavDrawerOption from './IconNavDrawerOption';

type Props = {
  path: string;
  label: string;
};

export default function ButtonNoLinkNavDrawerOption({ label }: Props) {
  return (
    <ListItemButton sx={{ width: 1, height: '100%' }}>
      <ListItemText
        primary={label}
        sx={{ color: (theme) => theme.palette.custom.navbar.lower.text }}
      />
      <IconNavDrawerOption label={label} />
    </ListItemButton>
  );
}
