import { BORDER_RADIUS, HOME_PAGE_SHOP_BY_CATEGORY } from '@/constants';
import { Box, Grid2, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
      <Skeleton
        variant="rectangular"
        sx={{ height: { xs: '300px', sm: '500px', md: '700px' }, borderRadius: BORDER_RADIUS }}
      />
      {Array.from(Array(2)).map((_, index) => (
        <Grid2
          key={index}
          component="ul"
          container
          spacing={{ xs: 2, sm: 3 }}>
          <Grid2
            component="li"
            size={{ xs: 6, sm: 3 }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{ borderRadius: BORDER_RADIUS }}
            />
          </Grid2>
          {Array.from(Array(3)).map((_, index) => (
            <Grid2
              key={index}
              component="li"
              size={{ xs: 6, sm: 3 }}>
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
      ))}
      <Skeleton
        variant="text"
        width="100%"
        sx={{ fontSize: { xs: 20, md: 28, lg: 36 } }}
      />
      <Grid2
        component="ul"
        container
        spacing={{ xs: 2, sm: 3 }}>
        {HOME_PAGE_SHOP_BY_CATEGORY.map((_, index) => (
          <Grid2
            component="li"
            key={index}
            size={{ xs: 12, sm: 4 }}>
            <Skeleton
              variant="rectangular"
              height="100%"
              width="100%"
              sx={{ aspectRatio: 4 / 5, borderRadius: BORDER_RADIUS }}
            />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
