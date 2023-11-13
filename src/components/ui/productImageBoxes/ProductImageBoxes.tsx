import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Box, Grid, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import SmallProductImageBox from './SmallProductImageBox';
import LargeProductImageBox from './LargeProductImageBox';
import { usePathname } from 'next/navigation';
import { ProductType } from '@/types';

type Props = { isEditMode?: boolean; product?: ProductType };

export default function ProductImageBoxes({ isEditMode, product }: Props) {
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { imageData, formData } = useAppSelector((state) => state.addProduct);
  const color = useCustomColorPalette();
  const theme = useTheme();
  const mode = theme.palette.mode;
  const borderColor = mode === 'dark' ? color.white.opacity.light : color.black.opacity.light;
  const boxBorderColor = isAdminView ? borderColor : 'transparent';

  useEffect(() => {
    if ((isAdminView && imageData.length === 0) || product?.product_image_data.length === 0) {
      setSelectedImageIndex(0);
    }
  }, [isAdminView, imageData, product]);

  function handleSelectedImage(index: number) {
    if (
      (isAdminView && index > imageData.length - 1) ||
      (product?.product_image_data && index > product?.product_image_data.length - 1)
    )
      return;
    setSelectedImageIndex(index);
  }

  return (
    <Grid
      container
      spacing={1}
      sx={{ maxWidth: isAdminView ? '500px' : null }}>
      <Grid
        item
        xs={12}
        md={2}
        sx={{ order: { xs: 2, md: 1 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', md: 'column' },
            gap: { xs: 1, md: `10.7px` },
          }}>
          {isAdminView
            ? Array.from(Array(5)).map((_, index) => (
                <SmallProductImageBox
                  key={index}
                  productName={formData.name}
                  productImageData={imageData[index]}
                  imageIndex={index}
                  borderColor={boxBorderColor}
                  isEditMode={isEditMode}
                  selectImage={() => handleSelectedImage(index)}
                  selectedImageIndex={selectedImageIndex}
                />
              ))
            : product?.product_image_data
                ?.sort((imageA, imageB) => imageA.index - imageB.index)
                .map((data) => (
                  <SmallProductImageBox
                    key={data.index}
                    productName={product?.name ?? ''}
                    productImageData={data || null}
                    imageIndex={data.index}
                    borderColor={boxBorderColor}
                    isEditMode={isEditMode}
                    selectImage={() => handleSelectedImage(data.index)}
                    selectedImageIndex={selectedImageIndex}
                  />
                ))}
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        md={10}
        sx={{ order: { xs: 1, md: 2 } }}>
        {isAdminView && imageData.length > 0 ? (
          <LargeProductImageBox
            productName={formData.name}
            productImageData={imageData[selectedImageIndex]}
            selectedImageIndex={selectedImageIndex}
            borderColor={boxBorderColor}
          />
        ) : (
          <LargeProductImageBox
            productName={product?.name ?? ''}
            productImageData={product?.product_image_data[selectedImageIndex]}
            selectedImageIndex={selectedImageIndex}
            borderColor={boxBorderColor}
          />
        )}
      </Grid>
    </Grid>
  );
}
