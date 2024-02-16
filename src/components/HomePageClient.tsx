'use client';

import useColorPalette from '@/hooks/useColorPalette';
import { ProductType } from '@/types';
import { Box, Divider, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ContainedButton from './ui/buttons/ContainedButton';
import { BORDER_RADIUS } from '@/config';
import ProductCard from './ui/productCard/ProductCard';
import { Suspense, useState } from 'react';

const categories = [
  {
    label: 'men',
    imageSrc: '/portrait-handsome-fashion-businessman-model-dressed-elegant-checkered-suit.jpg',
    path: '/products/men',
  },
  {
    label: 'women',
    imageSrc: '/vladimir-yelizarov-xmtEdCeBsww-unsplash.jpg',
    path: '/products/women',
  },
  {
    label: 'kids',
    imageSrc: '/terricks-noah-n9R0MN3XGvY-unsplash.jpg',
    path: '/products/kids',
  },
];

type ProductPreviewPros = {
  title: string;
  products: ProductType[] | undefined;
  onClick: () => void;
};

function ProductPreview({ title, products, onClick }: ProductPreviewPros) {
  const colorPalette = useColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;

  if (products?.length === 0) return null;

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
            backgroundColor: mode === 'dark' ? colorPalette.shade.dark : colorPalette.shade.light,
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
      {products && products.length > 0
        ? products.map((product, index) => (
            <Grid
              component="li"
              item
              key={index}
              xs={6}
              sm={3}>
              {product && (
                <ProductCard
                  product={product}
                  imageSizes="(min-width: 1260px) 270px, (min-width: 600px) calc(23.44vw - 21px), calc(50vw - 24px)"
                />
              )}
            </Grid>
          ))
        : null}
    </Grid>
  );
}

type HomePageClientProps = {
  allProducts: ProductType[] | undefined;
  saleProducts: ProductType[] | undefined;
};

export default function HomePageClient({ allProducts, saleProducts }: HomePageClientProps) {
  const router = useRouter();
  const [isHeroImageLoaded, setIsHeroImageLoaded] = useState(false);
  const [isCategoryImageLoaded, setIsCategoryImageLoaded] = useState(false);
  const colorPalette = useColorPalette();
  const productsOnSale = saleProducts?.slice(0, 3);
  const latestArrivals = allProducts?.filter((product) => product.isOnSale === 'No').slice(0, 3);

  function handleNavigateToSale() {
    router.push('/products/sale');
  }

  function handleNavigateToAllProducts() {
    router.push('/products/all-products');
  }

  function handleNavigateToCategory(path: string) {
    router.push(path);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
      <Box component="section">
        <Box
          sx={{
            position: 'relative',
            height: { xs: '300px', sm: '500px', md: '700px' },
          }}>
          <Image
            style={{ objectFit: 'cover', borderRadius: BORDER_RADIUS, opacity: !isHeroImageLoaded ? 0 : 100 }}
            fill
            sizes="(min-width: 1280px) 1152px, 92.08vw"
            src="/stylish-woman-with-shopping-bags.jpg"
            alt="Stylish woman with shopping bags"
            priority
            onLoad={() => setIsHeroImageLoaded(true)}
          />
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 1, md: 2 },
              justifyContent: 'center',
              width: 1,
              paddingX: { xs: '20px', sm: '50px' },
              height: 1,
              background: 'linear-gradient(to left, rgba(0, 0, 0, 0) 50%, rgba(255, 255, 255, 0.8))',
              borderRadius: BORDER_RADIUS,
            }}>
            <Typography
              component="h1"
              fontWeight={800}
              fontSize={{ xs: 32, sm: 48, md: 64, lg: 64 }}
              lineHeight={1.1}
              sx={{ color: colorPalette.typographyVariants.black, maxWidth: { xs: '40%', sm: '45%', lg: '50%' } }}>
              Where Fashion Meets Passion
            </Typography>
            <Typography
              component="p"
              fontWeight={500}
              fontSize={{ xs: 14, sm: 14, md: 16 }}
              sx={{
                color: colorPalette.shade.dark,
                maxWidth: { sm: '35%', lg: '40%' },
                display: { xs: 'none', sm: 'block' },
              }}>
              Immerse yourself in a world of self-expression at MyStore, where each piece tells a story and every outfit
              is a statement.
            </Typography>
            <Box sx={{ paddingTop: 2, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
              <ContainedButton
                label="explore the collection"
                backgroundColor="primary"
                onClick={handleNavigateToAllProducts}
                styles={{ boxShadow: 15 }}
              />
            </Box>
          </Box>
          {!isHeroImageLoaded ? (
            <Skeleton
              height="100%"
              width="100%"
              variant="rectangular"
            />
          ) : null}
        </Box>
      </Box>
      <Box
        component="section"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[
          { title: 'The Biggest Sale', products: productsOnSale, onClick: handleNavigateToSale },
          { title: 'Latest Arrivals', products: latestArrivals, onClick: handleNavigateToAllProducts },
        ].map((preview, index) => (
          <ProductPreview
            key={index}
            title={preview.title}
            products={preview.products}
            onClick={preview.onClick}
          />
        ))}
      </Box>
      <Box component="section">
        <Divider sx={{ paddingBottom: { xs: 2, sm: 3 } }}>
          <Typography
            component="h2"
            fontSize={{ xs: 20, md: 28, lg: 36 }}
            fontWeight={500}
            lineHeight={1.1}>
            SHOP BY CATEGORY
          </Typography>
        </Divider>
        <Grid
          component="ul"
          container
          spacing={{ xs: 2, sm: 3 }}>
          {categories.map((category) => (
            <Grid
              component="li"
              item
              key={category.label}
              xs={12}
              sm={4}>
              <Box
                onClick={() => handleNavigateToCategory(category.path)}
                sx={{
                  position: 'relative',
                  aspectRatio: 4 / 5,
                  cursor: 'pointer',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 1,
                    height: 1,
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 60%, rgba(0, 0, 0, 0.6))',
                    borderRadius: BORDER_RADIUS,
                    zIndex: 1,
                  },
                }}>
                <Image
                  style={{
                    objectFit: 'cover',
                    borderRadius: BORDER_RADIUS,
                    objectPosition: '50% 0%',
                    opacity: !isCategoryImageLoaded ? 0 : 100,
                  }}
                  fill
                  sizes="(min-width: 1280px) 368px, (min-width: 600px) calc(30.3vw - 14px), calc(100vw - 32px)"
                  src={category.imageSrc}
                  alt={`Image for category ${category.label}`}
                  onLoad={() => setIsCategoryImageLoaded(true)}
                />
                {!isCategoryImageLoaded ? (
                  <Skeleton
                    height="100%"
                    width="100%"
                    variant="rectangular"
                  />
                ) : null}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '85%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                  }}>
                  <Typography
                    component="h3"
                    fontSize={36}
                    fontWeight={600}
                    sx={{ color: colorPalette.typographyVariants.white }}>
                    {category.label.toUpperCase()}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
