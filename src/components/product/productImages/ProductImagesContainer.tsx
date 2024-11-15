import { Container, Grid2 } from '@mui/material';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  smallImages: ReactNode;
  largeImage: ReactNode;
};

export default function ProductImagesContainer({ smallImages, largeImage }: Props) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  return (
    <Container
      maxWidth={isAdminPath ? 'xs' : 'sm'}
      disableGutters>
      <Grid2
        container
        spacing={1}>
        <Grid2
          size={{ xs: 12, sm: 2 }}
          sx={{ order: { xs: 2, sm: 1 } }}>
          <Grid2
            container
            spacing={{ xs: 1, sm: 1.32 }}>
            {smallImages}
          </Grid2>
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 10 }}
          sx={{ order: { xs: 1, sm: 2 } }}>
          {largeImage}
        </Grid2>
      </Grid2>
    </Container>
  );
}
