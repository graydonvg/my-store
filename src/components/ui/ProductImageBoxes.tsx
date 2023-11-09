import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Grid, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import SmallProductImageBox from './SmallProductImageBox';
import LargeProductImageBox from './LargeProductImageBox';
import { usePathname } from 'next/navigation';

type Props = { isEditMode?: boolean };

export default function ProductImageBoxes({ isEditMode }: Props) {
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { imageData } = useAppSelector((state) => state.addProduct);
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? color.white.opacity.light : color.black.opacity.light;
  const boxBorderColor = isAdminView ? borderColor : 'transparent';
  const largeProductImageBoxHeight = document.getElementById('large-product-image-box')?.offsetHeight;
  const smallProductImageBoxHeight = document.getElementById('small-product-image-box')?.offsetHeight;
  const boxGap = (largeProductImageBoxHeight! - smallProductImageBoxHeight! * 5) / 4;

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
    <Grid
      container
      spacing={{ xs: 1, sm: 2 }}
      sx={{ maxWidth: isAdminView ? '400px' : null }}>
      <Grid
        item
        xs={12}
        sm={2}
        sx={{ order: { xs: 2, sm: 1 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'column' },
            gap: { xs: 1, sm: `${boxGap}px` },
          }}>
          {Array.from(Array(5)).map((_, index) => (
            <SmallProductImageBox
              key={index}
              imageIndex={index}
              borderColor={boxBorderColor}
              isEditMode={isEditMode}
              selectImage={() => handleSelectedImage(index)}
            />
          ))}
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={10}
        sx={{ order: { xs: 1, sm: 2 } }}>
        <LargeProductImageBox
          selectedImageIndex={selectedImageIndex}
          borderColor={boxBorderColor}
        />
      </Grid>
    </Grid>
  );
}
