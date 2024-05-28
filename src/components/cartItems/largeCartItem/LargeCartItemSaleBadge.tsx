import { Box, Typography } from '@mui/material';
import { CONSTANTS } from '@/constants';

type Props = {
  percentage: number;
};

export default function LargeCartItemSaleBadge({ percentage }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: CONSTANTS.BORDER_RADIUS,
        paddingX: 1,
        marginRight: 1,
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
        fontSize={{ xs: 14, sm: 16 }}
        fontWeight={600}>
        {`-${percentage}%`}
      </Typography>
    </Box>
  );
}
