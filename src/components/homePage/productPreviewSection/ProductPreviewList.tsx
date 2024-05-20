import { BORDER_RADIUS } from '@/data';
import { Product } from '@/types';
import { Box, Grid, Paper, Typography } from '@mui/material';
import ContainedButton from '../../ui/buttons/simple/ContainedButton';
import ProductCard from '../../product/productCard/ProductCard';

type Props = {
  title: string;
  products: Product[] | undefined;
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
            imageSizes="540px"
          />
        </Grid>
      ))}
    </Grid>
  );
}
