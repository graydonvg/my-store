import { CONSTANTS } from '@/constants';
import { Skeleton } from '@mui/material';

export default function PageHeaderSkeleton() {
  return (
    <Skeleton
      variant="rectangular"
      width="100%"
      sx={{ height: { xs: 55, sm: 61 }, marginBottom: 3, borderRadius: CONSTANTS.BORDER_RADIUS }}
    />
  );
}