import { BORDER_RADIUS } from '@/constants';
import { Box } from '@mui/material';

import { ReactNode } from 'react';

type Props = {
  boxBorderColor?: string;
  children?: ReactNode;
};

export default function LargeProductImageContainer({ boxBorderColor, children }: Props) {
  return (
    <Box
      sx={{
        aspectRatio: 3 / 4,
        border: boxBorderColor ? `1px solid ${boxBorderColor}` : null,
        position: 'relative',
        borderRadius: BORDER_RADIUS,
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }}>
      {children}
    </Box>
  );
}
