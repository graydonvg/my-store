'use client';

import { Box } from '@mui/material';
import AdminNavbar from '@/components/navbars/AdminNavbar';
import { ReactNode, useState } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);

  function toggleDrawer() {
    setOpen(!open);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <AdminNavbar
        toggleDrawer={toggleDrawer}
        open={open}>
        {children}
      </AdminNavbar>
    </Box>
  );
}
