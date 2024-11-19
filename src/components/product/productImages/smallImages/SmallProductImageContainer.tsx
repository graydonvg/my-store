import { Box, Grid2 } from '@mui/material';
import { ProductImageData } from '@/types';

import { ReactNode } from 'react';
import { BORDER_RADIUS } from '@/constants';

type Props = {
  productImageData?: ProductImageData;
  onClick?: () => void;
  imageIndex?: number;
  selectedImageIndex?: number;
  boxBorderColor?: string;
  children?: ReactNode;
};

export default function SmallProductImageContainer({
  productImageData,
  onClick,
  imageIndex,
  selectedImageIndex,
  boxBorderColor,
  children,
}: Props) {
  return (
    <Grid2 size={{ xs: 2.4, sm: 12 }}>
      <Box
        onClick={onClick}
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          aspectRatio: 3 / 4,
          outline: boxBorderColor ? `1px solid ${boxBorderColor}` : null,
          borderRadius: BORDER_RADIUS,
          overflow: 'hidden',
          opacity: productImageData && imageIndex !== selectedImageIndex ? '50%' : null,
        }}>
        {children}
      </Box>
    </Grid2>
  );
}
