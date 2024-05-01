'use client';

import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import Link from 'next/link';

export default function AddNewProductButton() {
  return (
    <Link href="/admin/add-new-product">
      <Fab
        aria-label="add new product"
        sx={(theme) => ({
          position: 'fixed',
          bottom: 24,
          right: 24,
          height: 72,
          width: 72,
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
          },
          '&:active': {
            backgroundColor: theme.palette.primary.light,
          },
          '@media (hover: hover)': {
            '&:hover': {
              backgroundColor: theme.palette.primary.light,
            },
          },
        })}>
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
