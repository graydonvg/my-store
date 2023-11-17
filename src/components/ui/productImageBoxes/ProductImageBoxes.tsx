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
  const { imageData, formData, imageUploadProgress } = useAppSelector((state) => state.addProduct);
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
    setSelectedImageIndex(index);
  }

  return (
    <Grid
      container
      spacing={{ xs: 0.5, sm: 1 }}
      sx={{ maxWidth: isAdminView ? '500px' : null }}>
      <Grid
        item
        xs={12}
        sm={2}
        sx={{ order: { xs: 2, sm: 1 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'column' },
            gap: { xs: 0.5, sm: `10.7px` },
          }}>
          {isAdminView
            ? imageData.map((data) => (
                <SmallProductImageBox
                  key={data.index}
                  productName={formData.name}
                  productImageData={data}
                  imageIndex={data.index}
                  isEditMode={isEditMode}
                  selectImage={() => handleSelectedImage(data.index)}
                  selectedImageIndex={selectedImageIndex}
                />
              ))
            : product?.product_image_data
                ?.sort((imageA, imageB) => imageA.index - imageB.index)
                .map((data) => (
                  <SmallProductImageBox
                    key={data.index}
                    productName={product?.name}
                    productImageData={data}
                    imageIndex={data.index}
                    isEditMode={isEditMode}
                    selectImage={() => handleSelectedImage(data.index)}
                    selectedImageIndex={selectedImageIndex}
                  />
                ))}
          {isAdminView
            ? imageUploadProgress.map((data, index) => (
                <SmallProductImageBox
                  key={index}
                  borderColor={boxBorderColor}
                  isEditMode={isEditMode}
                  uploadProgress={data.progress}
                />
              ))
            : null}
          {isAdminView && imageData.length === 0 && imageUploadProgress.length === 0 ? (
            <SmallProductImageBox
              borderColor={boxBorderColor}
              isEditMode={isEditMode}
            />
          ) : null}
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={10}
        sx={{ order: { xs: 1, sm: 2 } }}>
        {isAdminView ? (
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
