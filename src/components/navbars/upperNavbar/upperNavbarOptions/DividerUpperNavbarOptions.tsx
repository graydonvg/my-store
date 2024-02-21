import useColorPalette from '@/hooks/useColorPalette';
import { Divider } from '@mui/material';

export default function DividerUpperNavbarOptions() {
  const colorPalette = useColorPalette();

  return (
    <Divider
      variant="fullWidth"
      orientation="vertical"
      sx={{
        display: { xs: 'none', md: 'flex' },
        backgroundColor: colorPalette.navBar.upper.divider,
      }}
      flexItem
    />
  );
}
