'use client';

import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { CircularProgressWithLabel } from './progress/CircularProgressWithLabel';

type Props = { selectedImageIndex: number };

export default function LargeProductImageBox({ selectedImageIndex }: Props) {
  const { imageUploadProgress, imageData, formData } = useAppSelector((state) => state.addProduct);
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const textColor = mode === 'dark' ? color.white.opacity.strong : color.black.opacity.strong;

  return (
    <>
      {imageUploadProgress[selectedImageIndex] || imageData[selectedImageIndex] ? (
        imageData[selectedImageIndex] ? (
          <Image
            style={{ objectFit: 'cover', borderRadius: '4px' }}
            fill
            sizes="(min-width: 460px) 398px, calc(82.86vw + 33px)"
            src={imageData[selectedImageIndex].image_url}
            alt={`Image of ${formData.name}`}
            priority
          />
        ) : (
          <CircularProgressWithLabel value={imageUploadProgress[selectedImageIndex].progress} />
        )
      ) : (
        <Box sx={{ margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ color: textColor }}>No file chosen</Typography>
          <Typography
            variant="body2"
            sx={{ color: textColor }}>
            {'(Max. 5 images)'}
          </Typography>
        </Box>
      )}
    </>
  );
}
