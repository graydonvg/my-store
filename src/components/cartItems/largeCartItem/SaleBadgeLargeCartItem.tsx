import { Box, Typography } from '@mui/material';
import { BORDER_RADIUS } from '@/config';

type Props = {
  percentage: number;
};

export default function SaleBadgeLargeCartItem({ percentage }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: BORDER_RADIUS,
        paddingX: 1,
        marginRight: 1,
        backgroundColor: (theme) => theme.palette.custom.primary.dark,
        width: 'fit-content',
        height: 'fit-content',
      }}>
      <Typography
        lineHeight={1.6}
        component="span"
        sx={{
          color: (theme) => theme.palette.custom.typographyVariants.light,
        }}
        fontSize={{ xs: 14, sm: 16 }}
        fontWeight={600}>
        {`-${percentage}%`}
      </Typography>
    </Box>
  );
}
