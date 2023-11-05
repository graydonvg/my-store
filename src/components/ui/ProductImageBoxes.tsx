import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import SmallProductImageBox from './SmallProductImageBox';
import LargeProductImageBox from './LargeProductImageBox';

type Props = { isEditMode: boolean };

export default function ProductImageBoxes({ isEditMode }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { imageData } = useAppSelector((state) => state.addProduct);
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? color.white.opacity.light : color.black.opacity.light;

  useEffect(() => {
    if (imageData.length === 0) {
      setSelectedImageIndex(0);
    }
  }, [imageData]);

  function handleSelectedImage(index: number) {
    if (index > imageData.length - 1) return;
    setSelectedImageIndex(index);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box
        sx={{
          maxHeight: { xs: 'unset', sm: '400px' },
          maxWidth: { xs: '400px', sm: 'unset' },
          width: 1,
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
        }}>
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: '400px',
            aspectRatio: 1 / 1,
            border: `1px solid ${borderColor}`,
            position: 'relative',
            borderRadius: 1,
            order: { xs: 1, sm: 2 },
            display: 'grid',
            placeItems: 'center',
          }}>
          <LargeProductImageBox selectedImageIndex={selectedImageIndex} />
        </Box>
        <Box
          sx={{
            maxWidth: { xs: 'unset', sm: '80px' },
            maxHeight: { xs: '80px', sm: 'unset' },
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'column' },
            gap: 1,
            flexGrow: 1,
            order: { xs: 2, sm: 1 },
          }}>
          {Array.from(Array(5)).map((_, index) => (
            <SmallProductImageBox
              key={index}
              imageIndex={index}
              borderColor={borderColor}
              isEditMode={isEditMode}
              selectImage={() => handleSelectedImage(index)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
