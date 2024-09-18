import { CONSTANTS } from '@/constants';
import { Grid2, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <Grid2
      container
      spacing={{ xs: 2, sm: 3 }}
      sx={{ padding: { xs: 2, sm: 3 } }}>
      <Grid2 size={{ xs: 12, sm: 6, xl: 3 }}>
        <Skeleton
          variant="rectangular"
          height={130}
          width="100%"
          sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, xl: 3 }}>
        <Skeleton
          variant="rectangular"
          height={130}
          width="100%"
          sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, xl: 3 }}>
        <Skeleton
          variant="rectangular"
          height={130}
          width="100%"
          sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, sm: 6, xl: 3 }}>
        <Skeleton
          variant="rectangular"
          height={130}
          width="100%"
          sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, xl: 6 }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          sx={{
            height: { xs: 300, md: 360, lg: 420 },
            minHeight: { xs: 300, md: 360, lg: 420, xl: 1 },
            borderRadius: CONSTANTS.BORDER_RADIUS,
          }}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6, xl: 3 }}>
        <Skeleton
          variant="rectangular"
          height={568}
          width="100%"
          sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
        />
      </Grid2>
      <Grid2 size={{ xs: 12, lg: 6, xl: 3 }}>
        <Skeleton
          variant="rectangular"
          height={568}
          width="100%"
          sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
        />
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <Skeleton
          variant="rectangular"
          height={418}
          width="100%"
          sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
        />
      </Grid2>
    </Grid2>
  );
}
