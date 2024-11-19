'use client';

import { Box, Divider, Grid2, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import CategoryItem from './CategoryItem';
import { HOME_PAGE_SHOP_BY_CATEGORY } from '@/constants';

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
        <Grid2
          component="ul"
          container
          spacing={{ xs: 2, sm: 3 }}>
          {HOME_PAGE_SHOP_BY_CATEGORY.map((category) => (
            <Grid2
              component="li"
              key={category.label}
              size={{ xs: 12, sm: 4 }}>
              <CategoryItem
                category={category}
                onClick={navigateToCategory}
              />
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Box>
  );
}
