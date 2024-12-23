import PageHeaderSkeleton from '@/components/ui/PageHeaderSkeleton';
import { BORDER_RADIUS } from '@/constants';

import { Box, Grid2, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <Grid2
        container
        rowGap={6}>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: { xs: 'unset', md: '75%' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Skeleton
                variant="rectangular"
                height={36}
                width={120}
                sx={{ borderRadius: BORDER_RADIUS }}
              />
              {Array.from(Array(2)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={42}
                  sx={{ borderRadius: BORDER_RADIUS }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Skeleton
                variant="rectangular"
                height={36}
                width={260}
                sx={{ borderRadius: BORDER_RADIUS }}
              />
              {Array.from(Array(3)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={42}
                  sx={{ borderRadius: BORDER_RADIUS }}
                />
              ))}
            </Box>
          </Box>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton
              variant="rectangular"
              height={36}
              width={150}
              sx={{ borderRadius: BORDER_RADIUS }}
            />
            <Skeleton
              variant="rectangular"
              height={110}
              sx={{ borderRadius: BORDER_RADIUS }}
            />
            <Skeleton
              variant="rectangular"
              height={48}
              width={153}
              sx={{ borderRadius: BORDER_RADIUS, alignSelf: 'end' }}
            />
          </Box>
        </Grid2>
      </Grid2>
    </>
  );
}
