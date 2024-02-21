import { BORDER_RADIUS } from '@/config';
import useColorPalette from '@/hooks/useColorPalette';
import { Box, Typography } from '@mui/material';

type Props = {
  percentage: number;
};

export default function SalePercentageBadgeProductCard({ percentage }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: BORDER_RADIUS,
        paddingX: 0.5,
        backgroundColor: colorPalette.primary.dark,
        width: 'min-content',
      }}>
      <Typography
        component="span"
        variant="caption"
        sx={{
          textAlign: 'center',
          color: colorPalette.typographyVariants.white,
          textTransform: 'uppercase',
        }}>
        {`${percentage}% off`}
      </Typography>
    </Box>
  );
}
