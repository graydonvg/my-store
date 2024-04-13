'use client';

import useColorPalette from '@/hooks/useColorPalette';
import { Add } from '@mui/icons-material';
import { Fab } from '@mui/material';
import Link from 'next/link';

export default function AddNewProductButton() {
  const colorPalette = useColorPalette();

  return (
    <Link href="/admin/add-new-product">
      <Fab
        aria-label="add new product"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          height: 72,
          width: 72,
          backgroundColor: colorPalette.primary.dark,
          '&:hover': {
            backgroundColor: colorPalette.primary.dark,
          },
          '&:active': {
            backgroundColor: colorPalette.primary.light,
          },
          '@media (hover: hover)': {
            '&:hover': {
              backgroundColor: colorPalette.primary.light,
            },
          },
        }}>
        <Add
          fontSize="large"
          sx={{
            color: colorPalette.typographyVariants.white,
          }}
        />
      </Fab>
    </Link>
  );
}
