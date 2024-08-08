import { CONSTANTS } from '@/constants';
import { Box, Container, Divider, Grid, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <Grid
      container
      columnSpacing={4}
      rowSpacing={2}
      sx={{ height: 1 }}>
      <Grid
        item
        xs={12}
        md={6}>
        <Container
          maxWidth="sm"
          disableGutters>
          <Grid
            container
            spacing={1}>
            <Grid
              item
              xs={12}
              sm={2}
              sx={{ order: { xs: 2, sm: 1 } }}>
              <Grid
                container
                spacing={{ xs: 1, sm: 1.32 }}>
                {Array.from(Array(3)).map((_, index) => (
                  <Grid
                    key={index}
                    item
                    xs={2.4}
                    sm={12}>
                    <Skeleton
                      variant="rectangular"
                      height="100%"
                      width="100%"
                      sx={{ aspectRatio: 3 / 4, borderRadius: CONSTANTS.BORDER_RADIUS }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              sm={10}
              sx={{ order: { xs: 1, sm: 2 } }}>
              <Skeleton
                variant="rectangular"
                height="100%"
                width="100%"
                sx={{ aspectRatio: 3 / 4, borderRadius: CONSTANTS.BORDER_RADIUS }}
              />
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              paddingBottom: 2,
            }}>
            <Box>
              <Skeleton
                variant="text"
                width="100%"
                sx={{ fontSize: 30 }}
              />
              <Skeleton
                variant="text"
                width="50%"
                sx={{ fontSize: 16 }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                rowGap: 1,
                columnGap: 2,
              }}>
              <Skeleton
                variant="text"
                width="100%"
                sx={{ fontSize: 42 }}
              />
            </Box>
            <Divider />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              paddingBottom: 2,
            }}>
            <Skeleton
              variant="text"
              width="100px"
              sx={{ fontSize: 14 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height="56px"
              sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              paddingY: 4,
            }}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="48px"
              sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height="48px"
              sx={{ borderRadius: CONSTANTS.BORDER_RADIUS }}
            />
          </Box>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              paddingY: { xs: 1, sm: 2 },
            }}>
            <Skeleton
              variant="text"
              width="70px"
              sx={{ fontSize: 16 }}
            />
            <Skeleton
              variant="text"
              width="100%"
              sx={{ fontSize: 16 }}
            />
          </Box>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              paddingY: { xs: 1, sm: 2 },
            }}>
            <Skeleton
              variant="text"
              width="70px"
              sx={{ fontSize: 16 }}
            />
            <Skeleton
              variant="text"
              width="100%"
              sx={{ fontSize: 16 }}
            />
          </Box>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              paddingY: { xs: 1, sm: 2 },
            }}>
            <Skeleton
              variant="text"
              width="70px"
              sx={{ fontSize: 16 }}
            />
            {Array.from(Array(5)).map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                width="50%"
                sx={{ fontSize: 16 }}
              />
            ))}
            <Skeleton
              variant="text"
              width="50%"
              sx={{ fontSize: 16 }}
            />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
