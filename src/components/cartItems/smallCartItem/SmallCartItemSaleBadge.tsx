import { Box, Typography } from '@mui/material';
import { constants } from '@/constants';

type Props = {
  percentage: number;
};

export default function SmallCartItemSaleBadge({ percentage }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        borderRadius: constants.borderRadius,
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
