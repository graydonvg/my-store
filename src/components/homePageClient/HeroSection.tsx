import { BORDER_RADIUS, STORE_DESCRIPTION, STORE_SLOGAN } from '@/config';
import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import ContainedButton from '../ui/buttons/ContainedButton';
import { useState } from 'react';
import heroImage from '../../../public/stylish-woman-with-shopping-bags.jpg';

type Props = {
  navigateToAllProducts: () => void;
};

export default function HeroSection({ navigateToAllProducts }: Props) {
  const [isHeroImageLoaded, setIsHeroImageLoaded] = useState(false);

  return (
    <Box component="section">
      <Box
        sx={{
          position: 'relative',
          height: { xs: '300px', sm: '500px', md: '700px' },
          borderRadius: BORDER_RADIUS,
          overflow: 'hidden',
        }}>
        <Image
          src={heroImage}
          alt="Stylish woman with shopping bags"
          fill
          priority
          onLoad={() => setIsHeroImageLoaded(true)}
          sizes="(min-width: 1280px) 1152px, 92.08vw"
          style={{ objectFit: 'cover', opacity: !isHeroImageLoaded ? 0 : 100 }}
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
            sx={{
              color: (theme) => theme.palette.custom.typographyVariants.black,
              maxWidth: { xs: '40%', sm: '45%', lg: '50%' },
            }}>
            {STORE_SLOGAN}
          </Typography>
          <Typography
            component="p"
            fontWeight={500}
            fontSize={{ xs: 14, sm: 14, md: 16 }}
            sx={{
              color: (theme) => theme.palette.custom.shade.dark,
              maxWidth: { sm: '35%', lg: '40%' },
              display: { xs: 'none', sm: 'block' },
            }}>
            {STORE_DESCRIPTION}
          </Typography>
          <Box sx={{ paddingTop: 2, alignSelf: { xs: 'center', sm: 'flex-start' } }}>
            <ContainedButton
              label="explore the collection"
              backgroundColor="primary"
              onClick={navigateToAllProducts}
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
  );
}
