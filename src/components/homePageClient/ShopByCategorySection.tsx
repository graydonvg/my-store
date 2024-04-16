import { BORDER_RADIUS, HOME_PAGE_CATEGORIES } from '@/config';
import { Box, Divider, Grid, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ShopByCategorySection() {
  const router = useRouter();
  const [isCategoryImageLoaded, setIsCategoryImageLoaded] = useState(false);

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
          lineHeight={1.1}>
          SHOP BY CATEGORY
        </Typography>
      </Divider>
      <Grid
        component="ul"
        container
        spacing={{ xs: 2, sm: 3 }}>
        {HOME_PAGE_CATEGORIES.map((category) => (
          <Grid
            component="li"
            item
            key={category.label}
            xs={12}
            sm={4}>
            <Box
              onClick={() => navigateToCategory(category.path)}
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
                  style={{ borderRadius: BORDER_RADIUS }}
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
                  sx={{ color: (theme) => theme.palette.custom.typographyVariants.white }}>
                  {category.label.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
