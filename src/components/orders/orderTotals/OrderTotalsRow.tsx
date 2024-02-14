import { BORDER_RADIUS } from '@/config';
import { Box, Typography } from '@mui/material';

type Props = {
  label: string;
  price: string;
  fontSize: number;
  fontWeight?: number;
  backgroundColor?: string;
};

export default function OrderTotalsRow({ label, price, fontSize, fontWeight, backgroundColor }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 1,
        padding: 1,
        backgroundColor,
        borderRadius: BORDER_RADIUS,
      }}>
      <Typography
        paddingRight={2}
        component="span"
        fontSize={fontSize}
        fontWeight={fontWeight}>
        {label}
      </Typography>
      <Box sx={{ whiteSpace: 'nowrap' }}>
        <Typography
          component="span"
          fontSize={fontSize}
          fontWeight={fontWeight}>
          {price}
        </Typography>
      </Box>
    </Box>
  );
}
