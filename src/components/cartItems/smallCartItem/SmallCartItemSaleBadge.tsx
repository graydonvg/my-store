import { BORDER_RADIUS } from '@/constants';
import { Box, Typography } from '@mui/material';

type Props = {
  percentage: number;
};

export default function SmallCartItemSaleBadge({ percentage }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: BORDER_RADIUS,
        paddingX: 1,
        backgroundColor: (theme) => theme.palette.primary.main,
        width: 'fit-content',
        height: 'fit-content',
      }}>
      <Typography
        lineHeight={1.6}
        component="span"
        sx={{
          color: (theme) => theme.palette.primary.contrastText,
        }}
        fontSize={14}>
        {`-${percentage}%`}
      </Typography>
    </Box>
  );
}
