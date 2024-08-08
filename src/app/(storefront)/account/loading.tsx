import PageHeaderSkeleton from '@/components/ui/PageHeaderSkeleton';
import { CONSTANTS } from '@/constants';
import { Box, Grid, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton />
      <Grid
        container
        rowGap={2}>
        <Grid
          item
          xs={12}
          md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: { xs: 'unset', md: '75%' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Skeleton
                variant="text"
                sx={{ fontSize: 24 }}
              />
              {Array.from(Array(2)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height="42px"
                  sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Skeleton
                variant="text"
                sx={{ fontSize: 24 }}
              />
              {Array.from(Array(3)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height="42px"
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
              variant="text"
              sx={{ fontSize: 24 }}
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
