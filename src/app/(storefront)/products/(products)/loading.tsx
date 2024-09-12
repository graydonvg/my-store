import PageHeaderSkeleton from '@/components/ui/PageHeaderSkeleton';
import { CONSTANTS } from '@/constants';
import { Box, Grid, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <Grid
        component="ul"
        container
        spacing={{ xs: 2, md: 3 }}>
        {Array.from(Array(6)).map((_, index) => (
          <Grid
            component="li"
            key={index}
            item
            xs={6}
            md={4}
            lg={3}>
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
          </Grid>
        ))}
      </Grid>
    </>
  );
}
