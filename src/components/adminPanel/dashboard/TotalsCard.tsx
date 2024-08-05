import { CONSTANTS } from '@/constants';
import { Paper } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function TotalsCard({ children }: Props) {
  return (
    <Paper
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, sm: 0 },
        minHeight: 'fit-content',
        height: 1,
        borderRadius: CONSTANTS.BORDER_RADIUS,
      }}>
      {children}
    </Paper>
  );
}
