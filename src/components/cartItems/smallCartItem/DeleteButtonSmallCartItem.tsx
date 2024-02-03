'use client';

import { Box, IconButton } from '@mui/material';
import { Spinner } from '../../ui/progress/Spinner';
import { Close } from '@mui/icons-material';
import useColorPalette from '@/hooks/useColorPalette';
import { MouseEvent } from 'react';

type Props = {
  isLoading: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => Promise<void>;
};

export default function DeleteButtonSmallCartItem({ isLoading, onClick }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'grid',
        placeItems: 'center',
        width: '20px',
        height: '20px',
      }}>
      {isLoading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', width: 1, height: 1 }}>
          <Spinner
            thickness={5}
            size={12}
            spinnerColor={colorPalette.typographyVariants.grey}
          />
        </Box>
      ) : null}
      {!isLoading ? (
        <IconButton
          disabled={isLoading}
          onClick={onClick}
          sx={{ padding: 0, width: 1, height: 1 }}>
          <Close
            fontSize="small"
            sx={{ color: colorPalette.typographyVariants.grey }}
          />
        </IconButton>
      ) : null}
    </Box>
  );
}
