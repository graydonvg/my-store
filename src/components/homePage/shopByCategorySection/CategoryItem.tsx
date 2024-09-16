import { useState } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { CONSTANTS } from '@/constants';

type CategoryItemProps = {
  category: {
    label: string;
    imageSrc: string;
    path: string;
  };
  onClick: (path: string) => void;
};

function CategoryItem({ category, onClick }: CategoryItemProps) {
  const [isCategoryImageLoaded, setIsCategoryImageLoaded] = useState(false);

  return (
    <Box
      onClick={() => onClick(category.path)}
      sx={{
        position: 'relative',
        aspectRatio: 4 / 5,
        borderRadius: CONSTANTS.BORDER_RADIUS,
        overflow: 'hidden',
        cursor: 'pointer',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 60%, rgba(0, 0, 0, 0.6))',
          borderRadius: CONSTANTS.BORDER_RADIUS,
          zIndex: 1,
        },
      }}>
      <Image
        style={{
          objectFit: 'cover',
          objectPosition: '50% 0%',
          opacity: !isCategoryImageLoaded ? 0 : 1,
          transition: 'opacity 0.4s ease-in-out',
        }}
        fill
        sizes="(min-width: 600px) calc(25vw - 100px), 50vw"
        src={category.imageSrc}
        alt={`Image for category ${category.label}`}
        onLoad={() => setIsCategoryImageLoaded(true)}
      />

      {!isCategoryImageLoaded && (
        <Skeleton
          height="100%"
          width="100%"
          variant="rectangular"
        />
      )}
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
          sx={{ color: (theme) => theme.palette.common.white }}>
          {category.label.toUpperCase()}
        </Typography>
      </Box>
    </Box>
  );
}

export default CategoryItem;
