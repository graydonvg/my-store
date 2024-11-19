import { BORDER_RADIUS } from '@/constants';
import { Box, Typography } from '@mui/material';

type Props = {
  percentage: number;
};

export default function ProductCardSalePercentageBadge({ percentage }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: BORDER_RADIUS,
        paddingX: 0.5,
        backgroundColor: (theme) => theme.palette.primary.main,
        width: 'min-content',
      }}>
      <Typography
        component="span"
        variant="caption"
        sx={{
          textAlign: 'center',
          color: (theme) => theme.palette.primary.contrastText,
          textTransform: 'uppercase',
        }}>
        {`${percentage}% off`}
      </Typography>
    </Box>
  );
}
