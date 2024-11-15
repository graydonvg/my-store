import { Box } from '@mui/material';
import { CONSTANTS } from '@/constants';
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
        borderRadius: CONSTANTS.BORDER_RADIUS,
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }}>
      {children}
    </Box>
  );
}
