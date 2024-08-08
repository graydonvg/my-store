import { CONSTANTS } from '@/constants';
import { Box, Grid, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <>
      <Skeleton
        variant="rectangular"
        width="100%"
        sx={{ height: { xs: 55, sm: 61 }, marginBottom: 3, borderRadius: CONSTANTS.BORDER_RADIUS }}
      />
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
            sm={3}
            lg={2}>
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
