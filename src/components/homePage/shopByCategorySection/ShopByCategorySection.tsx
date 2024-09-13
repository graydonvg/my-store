'use client';

import { CONSTANTS } from '@/constants';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import CategoryItem from './CategoryItem';

export default function ShopByCategorySection() {
  const router = useRouter();

  function navigateToCategory(path: string) {
    router.push(path);
  }

  return (
    <Box component="section">
      <Divider sx={{ paddingBottom: { xs: 2, sm: 3 } }}>
        <Typography
          component="h2"
          fontSize={{ xs: 20, md: 28, lg: 36 }}
          fontWeight={500}
          lineHeight={1.1}
          sx={{ textTransform: 'uppercase' }}>
          shop by category
        </Typography>
      </Divider>
      <Box component="nav">
        <Grid
          component="ul"
          container
          spacing={{ xs: 2, sm: 3 }}>
          {CONSTANTS.HOME_PAGE_SHOP_BY_CATEGORY.map((category) => (
            <Grid
              component="li"
              item
              key={category.label}
              xs={12}
              sm={4}>
              <CategoryItem
                category={category}
                onClick={navigateToCategory}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
