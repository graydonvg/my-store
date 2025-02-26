import { Product } from '@/types';
import { Box, Grid2, Paper, Typography } from '@mui/material';
import ContainedButton from '../../ui/buttons/ContainedButton';
import ProductCard from '../../product/productCard/ProductCard';
import { BORDER_RADIUS } from '@/constants';

type Props = {
  title: string;
  products: Product[];
  onClick: () => void;
};

export default function ProductPreviewList({ title, products, onClick }: Props) {
  return (
    <Grid2
      component="ul"
      container
      spacing={{ xs: 2, sm: 3 }}>
      <Grid2
        component="li"
        size={{ xs: 6, sm: 3 }}>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: (theme) => theme.palette.custom.navbar.lower.background,
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
              color="primary"
            />
          </Box>
        </Paper>
      </Grid2>

      {products.map((product) => (
        <Grid2
          component="li"
          key={product.productId}
          size={{ xs: 6, sm: 3 }}>
          <ProductCard
            product={product}
            imageSizes="(min-width: 1210px) 270px, (min-width: 600px) calc(23.44vw - 21px), calc(50vw - 24px)"
          />
        </Grid2>
      ))}
    </Grid2>
  );
}
