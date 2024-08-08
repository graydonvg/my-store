import PageHeaderSkeleton from '@/components/ui/PageHeaderSkeleton';
import { CONSTANTS } from '@/constants';
import { Box, Grid, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <Grid
        container
        rowGap={6}>
        <Grid
          item
          xs={12}
          md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: { xs: 'unset', md: '75%' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Skeleton
                variant="rectangular"
                height={36}
                width={120}
                sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
              />
              {Array.from(Array(2)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={42}
                  sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Skeleton
                variant="rectangular"
                height={36}
                width={260}
                sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
              />
              {Array.from(Array(3)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={42}
                  sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
                />
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Skeleton
              variant="rectangular"
              height={36}
              width={150}
              sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
            />
            <Skeleton
              variant="rectangular"
              height={110}
              sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
            />
            <Skeleton
              variant="rectangular"
              height={48}
              width={153}
              sx={{ borderRadius: CONSTANTS.BORDER_RADIUS, alignSelf: 'end' }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
