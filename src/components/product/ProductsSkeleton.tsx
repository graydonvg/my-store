import { BORDER_RADIUS } from '@/constants';
import { Box, Grid2, Skeleton } from '@mui/material';

export function ProductsSkeleton() {
  return (
    <Grid2
      component="ul"
      container
      spacing={{ xs: 2, md: 3 }}>
      {Array.from(Array(6)).map((_, index) => (
        <Grid2
          component="li"
          key={index}
          size={{ xs: 6, md: 4, lg: 3 }}>
          <Box>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ aspectRatio: 25 / 36, borderRadius: BORDER_RADIUS }}
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
  );
}
