import { ListItemButton, ListItemText } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import IconNavDrawerOption from './IconNavDrawerOption';

type Props = {
  path: string;
  label: string;
};

export default function ButtonNoLinkNavDrawerOption({ label }: Props) {
  const colorPalette = useColorPalette();

  return (
    <ListItemButton sx={{ width: 1, height: '100%' }}>
      <ListItemText
        primary={label}
        sx={{ color: colorPalette.navBar.lower.text }}
      />
      <IconNavDrawerOption label={label} />
    </ListItemButton>
  );
}
