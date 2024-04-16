import { BORDER_RADIUS } from '@/config';
import { ProductType } from '@/types';
import { Box, Grid, Typography } from '@mui/material';
import ContainedButton from '../../ui/buttons/ContainedButton';
import ProductCard from '../../ui/productCard/ProductCard';

type Props = {
  title: string;
  products: ProductType[] | undefined;
  onClick: () => void;
};

export default function ProductPreviewList({ title, products, onClick }: Props) {
  return (
    <Grid
      component="ul"
      container
      spacing={{ xs: 2, sm: 3 }}>
      <Grid
        component="li"
        item
        xs={6}
        sm={3}>
        <Box
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? theme.palette.custom.shade.dark : theme.palette.custom.shade.light,
            borderRadius: BORDER_RADIUS,
            padding: { xs: 2, lg: 4 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
            height: 1,
          }}>
          <Typography
            component="h2"
            fontSize={{ xs: 24, sm: 20, md: 36 }}
            fontWeight={500}
            lineHeight={1.1}>
            {title}
          </Typography>
          <Box>
            <ContainedButton
              onClick={onClick}
              label="shop all"
              backgroundColor="primary"
            />
          </Box>
        </Box>
      </Grid>

      {products?.map((product, index) => (
        <Grid
          component="li"
          item
          key={index}
          xs={6}
          sm={3}>
          <ProductCard
            product={product}
            imageSizes="(min-width: 1260px) 270px, (min-width: 600px) calc(23.44vw - 21px), calc(50vw - 24px)"
          />
        </Grid>
      ))}
    </Grid>
  );
}
