import PageHeaderSkeleton from '@/components/ui/PageHeaderSkeleton';
import { CONSTANTS } from '@/constants';
import { Box, Grid2, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <Grid2
        component="ul"
        container
        spacing={{ xs: 2, md: 3 }}>
        {Array.from(Array(3)).map((_, index) => (
          <Grid2
            component="li"
            key={index}
            size={{ xs: 6, sm: 3, lg: 2 }}>
            <Box>
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{ aspectRatio: 25 / 36, borderRadius: CONSTANTS.BORDER_RADIUS }}
              />
              <Box sx={{ paddingY: 1 }}>
                <Skeleton variant="text" />
                <Skeleton
                  variant="text"
                  width="50%"
                />
                <Skeleton variant="text" />
              </Box>
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </>
  );
}
