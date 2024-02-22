import { Box, Typography } from '@mui/material';
import useColorPalette from '@/hooks/useColorPalette';
import { BORDER_RADIUS } from '@/config';

type Props = {
  percentage: number;
};

export default function SaleBadgeLargeCartItem({ percentage }: Props) {
  const colorPalette = useColorPalette();

  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: BORDER_RADIUS,
        paddingX: 1,
        marginRight: 1,
        backgroundColor: colorPalette.primary.dark,
        width: 'fit-content',
        height: 'fit-content',
      }}>
      <Typography
        lineHeight={1.6}
        component="span"
        sx={{
          color: colorPalette.typographyVariants.white,
        }}
        fontSize={{ xs: 14, sm: 16 }}
        fontWeight={600}>
        {`-${percentage}%`}
      </Typography>
    </Box>
  );
}
