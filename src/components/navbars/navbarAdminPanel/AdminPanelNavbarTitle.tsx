import { Typography } from '@mui/material';
import { useSelectedLayoutSegments } from 'next/navigation';

export default function AdminPanelNavbarTitle() {
  const segments = useSelectedLayoutSegments();
  const currentPath = segments.at(-1)?.split('-').join(' ') ?? '';

  return (
    <Typography
      component="h1"
      variant="h6"
      noWrap
      sx={{ textTransform: 'capitalize', color: (theme) => theme.palette.custom.navbar.upper.text }}>
      {currentPath}
    </Typography>
  );
}
