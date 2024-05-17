'use client';

import { Divider } from '@mui/material';

export default function DividerUpperNavbarOptions() {
  return (
    <Divider
      variant="fullWidth"
      orientation="vertical"
      sx={{
        display: { xs: 'none', md: 'flex' },
        backgroundColor: (theme) => theme.palette.custom.navbar.upper.divider,
      }}
      flexItem
    />
  );
}
