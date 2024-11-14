'use client';

import { CONSTANTS } from '@/constants';
import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import ContainedButton from '../ui/buttons/ContainedButton';
import { useState } from 'react';
import heroImage from '../../../public/stylish-woman-with-shopping-bags.jpg';
import { useRouter } from 'next/navigation';

const STORE_SLOGAN = 'Where Fashion Meets Passion';
const STORE_INTRODUCTION = `Immerse yourself in a world of self-expression at ${CONSTANTS.STORE_NAME}, where each piece tells a story and every outfit is a statement`;

export default function HeroSection() {
  const router = useRouter();
  const [isHeroImageLoaded, setIsHeroImageLoaded] = useState(false);

  function navigateToAllProducts() {
    router.push('/products/all-products');
  }

  return (
    <Box component="section">
      <Box
        sx={{
          position: 'relative',
          height: { xs: '300px', sm: '500px', md: '700px' },
          borderRadius: CONSTANTS.BORDER_RADIUS,
          overflow: 'hidden',
        }}>
        <Image
          src={heroImage}
          alt="Stylish woman with shopping bags"
          fill
          priority
          onLoad={() => setIsHeroImageLoaded(true)}
          sizes="(min-width: 1210px) 1152px, 95vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center 20%',
            opacity: !isHeroImageLoaded ? 0 : 100,
          }}
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
            borderRadius: CONSTANTS.BORDER_RADIUS,
            opacity: !isHeroImageLoaded ? 0 : 100,
          }}>
          <Typography
            component="h1"
            fontWeight={800}
            fontSize={{ xs: 32, sm: 48, md: 64, lg: 64 }}
            lineHeight={1.1}
            sx={{
              color: (theme) => theme.palette.grey[900],
              maxWidth: { xs: '40%', sm: '45%', lg: '50%' },
            }}>
            {STORE_SLOGAN}
          </Typography>
          <Typography
            component="p"
            fontWeight={500}
            fontSize={{ xs: 14, sm: 14, md: 16 }}
            sx={{
              color: (theme) => theme.palette.grey[700],
              maxWidth: { sm: '35%', lg: '40%' },
              display: { xs: 'none', sm: 'block' },
            }}>
            {STORE_INTRODUCTION}
          </Typography>
          <Box sx={{ paddingTop: 2, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
            <ContainedButton
              label="explore the collection"
              color="primary"
              onClick={navigateToAllProducts}
              sxStyles={{ boxShadow: 4 }}
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
  );
}
