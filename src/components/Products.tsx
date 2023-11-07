import { Grid, Typography } from '@mui/material';
import ProductCard from './ui/ProductCard';
import { categories } from '@/lib/utils';
import { ProductType } from '@/types';

type Props = {
  products: ProductType[];
};

export default function Products({ products }: Props) {
  return (
    // <Grid
    //   container
    //   spacing={4}>
    //   {categories?.map((category) => {
    //     return (
    //       <Grid
    //         xs={12}
    //         item
    //         key={category}>
    //         <Typography
    //           sx={{ textAlign: 'center', paddingBottom: 2 }}
    //           component="h2"
    //           variant="h5">
    //           {category}
    //         </Typography>
    <Grid
      container
      spacing={{ xs: 0.3, md: 2 }}>
      {products.map((product, index) => (
        // return product.category === category ? (?
        <Grid
          key={index}
          item
          xs={6}
          md={4}
          lg={3}
          xl={2}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
    //       </Grid>
    //     );
    //   })}
    // </Grid>
  );
}
