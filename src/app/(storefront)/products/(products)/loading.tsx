import { ProductsSkeleton } from '@/components/product/Products';
import PageHeaderSkeleton from '@/components/ui/PageHeaderSkeleton';
import { Box, Container, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
      <Box
        sx={{
          position: 'sticky',
          top: 122,
          left: 0,
          flexBasis: '240px',
          flexShrink: 0,
          maxHeight: '870px',
          display: { xs: 'none', md: 'block' },
        }}>
        <Skeleton
          variant="rectangular"
          sx={{ height: 1 }}
        />
      </Box>

      <Container
        component="main"
        disableGutters>
        <PageHeaderSkeleton />
        <ProductsSkeleton />
      </Container>
    </Box>
  );
}
