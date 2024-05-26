import { constants } from '@/constants';
import { Box, Skeleton } from '@mui/material';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type Props = {
  imageUrl: string;
  imageSizes: string;
  productName: string;
};

export default function ProductCardImage({ imageUrl, imageSizes, productName }: Props) {
  const pathname = usePathname();
  const isAdminDashboardPath = pathname.startsWith('/admin/dashboard');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: !isAdminDashboardPath ? 25 / 36 : 14 / 18,
        borderTopLeftRadius: constants.borderRadius,
        borderTopRightRadius: constants.borderRadius,
        overflow: 'hidden',
      }}>
      <Image
        style={{
          objectFit: 'cover',
          opacity: !isImageLoaded ? 0 : 100,
        }}
        fill
        sizes={imageSizes}
        src={imageUrl!}
        alt={`Image for ${productName}`}
        onLoad={() => setIsImageLoaded(true)}
      />

      {!isImageLoaded ? (
        <Skeleton
          height="100%"
          width="100%"
          variant="rectangular"
        />
      ) : null}
    </Box>
  );
}
