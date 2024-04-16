import { BORDER_RADIUS } from '@/config';
import { Box, Typography } from '@mui/material';

type Props = {
  percentage: number;
};

export default function SalePercentageBadgeProductCard({ percentage }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: BORDER_RADIUS,
        paddingX: 0.5,
        backgroundColor: (theme) => theme.palette.custom.primary.dark,
        width: 'min-content',
      }}>
      <Typography
        component="span"
        variant="caption"
        sx={{
          textAlign: 'center',
          color: (theme) => theme.palette.custom.typographyVariants.white,
          textTransform: 'uppercase',
        }}>
        {`${percentage}% off`}
      </Typography>
    </Box>
  );
}
