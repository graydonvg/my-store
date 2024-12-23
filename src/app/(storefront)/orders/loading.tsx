import PageHeaderSkeleton from '@/components/ui/PageHeaderSkeleton';
import { BORDER_RADIUS } from '@/constants';

import { Box, Grid2, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <Box component="ul">
        {Array.from(Array(2)).map((_, index) => {
          return (
            <Grid2
              component="li"
              key={index}
              container
              spacing={3}
              sx={{ marginBottom: 4 }}>
              <Grid2
                size={{ xs: 3 }}
                sx={{ display: { xs: 'none', md: 'block' } }}>
                <Skeleton
                  height={500}
                  variant="rectangular"
                  sx={{ borderRadius: BORDER_RADIUS }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 9 }}>
                <Skeleton
                  height={500}
                  variant="rectangular"
                  sx={{ borderRadius: BORDER_RADIUS }}
                />
              </Grid2>
            </Grid2>
          );
        })}
      </Box>
    </>
  );
}
