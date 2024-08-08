import PageHeaderSkeleton from '@/components/ui/PageHeaderSkeleton';
import { CONSTANTS } from '@/constants';
import { Box, Grid, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <Box component="ul">
        {Array.from(Array(2)).map((_, index) => {
          return (
            <Grid
              component="li"
              key={index}
              container
              spacing={3}
              sx={{ marginBottom: 4 }}>
              <Grid
                item
                xs={3}
                sx={{ display: { xs: 'none', md: 'block' } }}>
                <Skeleton
                  height={500}
                  variant="rectangular"
                  sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={9}>
                <Skeleton
                  height={500}
                  variant="rectangular"
                  sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
                />
              </Grid>
            </Grid>
          );
        })}
      </Box>
    </>
  );
}
