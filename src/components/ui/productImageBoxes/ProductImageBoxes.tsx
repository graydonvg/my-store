import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Container, Grid, useTheme } from '@mui/material';
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

  useEffect(() => {
    if (!imageData[selectedImageIndex]) {
      setSelectedImageIndex(0);
    }
  }, [imageData, selectedImageIndex]);

  function handleSelectedImage(index: number) {
    setSelectedImageIndex((prevIndex) => (index !== prevIndex ? index : prevIndex));
  }

  return (
    <Container
      maxWidth={isAdminView ? 'xs' : 'sm'}
      disableGutters>
      <Grid
        container
        spacing={{ xs: 0.5, sm: 1 }}>
        <Grid
          item
          xs={12}
          sm={2}
          sx={{ order: { xs: 2, sm: 1 } }}>
          <Grid
            container
            spacing={{ xs: 0.5, sm: 1.28 }}>
            {isAdminView
              ? imageData.map((data, index) => (
                  <SmallProductImageBox
                    key={data.file_name}
                    productName={formData.name}
                    productImageData={data}
                    imageIndex={index}
                    isEditMode={isEditMode}
                    selectImage={() => handleSelectedImage(index)}
                    selectedImageIndex={selectedImageIndex}
                  />
                ))
              : product?.product_image_data.map((data, index) => (
                  <SmallProductImageBox
                    key={data.product_image_id}
                    productName={product?.name}
                    productImageData={data}
                    imageIndex={index}
                    isEditMode={isEditMode}
                    selectImage={() => handleSelectedImage(index)}
                    selectedImageIndex={selectedImageIndex}
                  />
                ))}
            {isAdminView
              ? imageUploadProgress.map((data, index) => (
                  <SmallProductImageBox
                    key={index}
                    borderColor={boxBorderColor}
                    isEditMode={isEditMode}
                    uploadProgressData={data}
                  />
                ))
              : null}
            {isAdminView
              ? Array.from(Array(5 - imageData.length - imageUploadProgress.length)).map((_, index) => (
                  <SmallProductImageBox
                    key={`placeholder-${index}`}
                    borderColor={boxBorderColor}
                    isEditMode={isEditMode}
                  />
                ))
              : null}
          </Grid>
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
    </Container>
  );
}
