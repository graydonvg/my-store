'use client';

import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import Link from 'next/link';

export default function AddNewProductButton() {
  return (
    <Link href="/admin/add-new-product">
      <Fab
        color="primary"
        aria-label="add new product"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          height: 72,
          width: 72,
        }}>
        <Add
          fontSize="large"
          sx={{
            color: (theme) => theme.palette.primary.contrastText,
          }}
        />
      </Fab>
    </Link>
  );
}
