import { useAppSelector } from '@/lib/redux/hooks';
import { Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import LargeProductImageBox from './LargeProductImageBox';
import { usePathname } from 'next/navigation';
import { ProductType } from '@/types';
import useColorPalette from '@/hooks/useColorPalette';
import ClientViewSmallProductImageBox from './smallProductImageBox/ClientViewSmallProductImageBox';
import AdminViewSmallProductImageBoxes from './smallProductImageBox/AdminViewSmallProductImageBoxes';

type Props = {
  product?: ProductType;
  maxImageCount?: number;
};

export default function ProductImageBoxes({ product, maxImageCount }: Props) {
  const colorPalette = useColorPalette();
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { productFormData } = useAppSelector((state) => state.productForm);
  const { imageData, imageUploadProgress } = useAppSelector((state) => state.productImages);

  useEffect(() => {
    if ((isAdminView && imageData.length === 0) || product?.productImageData.length === 0) {
      setSelectedImageIndex(0);
    }
  }, [isAdminView, imageData, product]);

  useEffect(() => {
    if (isAdminView && !imageData[selectedImageIndex]) {
      setSelectedImageIndex(0);
    }
  }, [imageData, selectedImageIndex, isAdminView]);

  function handleSelectedImage(index: number) {
    setSelectedImageIndex(index);
  }

  function getBoxBorderColor({ defaultBorderColor = false, focusedBorderColor = false }) {
    if (focusedBorderColor) {
      return colorPalette.textField.focused;
    } else if (defaultBorderColor) {
      return colorPalette.textField.border;
    } else {
      return 'transparent';
    }
  }

  return (
    <Container
      maxWidth={isAdminView ? 'xs' : 'sm'}
      disableGutters>
      <Grid
        container
        spacing={1}>
        <Grid
          item
          xs={12}
          sm={2}
          sx={{ order: { xs: 2, sm: 1 } }}>
          <Grid
            container
            spacing={{ xs: 1, sm: 1.32 }}>
            {!isAdminView && product ? (
              <ClientViewSmallProductImageBox
                product={product}
                selectImage={handleSelectedImage}
                selectedImageIndex={selectedImageIndex}
                boxBorderColor="transparent"
              />
            ) : null}

            {isAdminView ? (
              <AdminViewSmallProductImageBoxes
                selectImage={handleSelectedImage}
                selectedImageIndex={selectedImageIndex}
                getBoxBorderColor={getBoxBorderColor}
                maxImageCount={maxImageCount!}
              />
            ) : null}
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={10}
          sx={{ order: { xs: 1, sm: 2 } }}>
          {!isAdminView && product ? (
            <LargeProductImageBox
              productName={product?.name ?? ''}
              productImageData={product?.productImageData[selectedImageIndex]}
              selectedImageIndex={selectedImageIndex}
              boxBorderColor="transparent"
            />
          ) : null}

          {isAdminView ? (
            <LargeProductImageBox
              productName={productFormData.name}
              productImageData={imageData[selectedImageIndex]}
              selectedImageIndex={selectedImageIndex}
              maxImageCount={maxImageCount}
              boxBorderColor={getBoxBorderColor({
                defaultBorderColor: !imageData[selectedImageIndex],
                focusedBorderColor: imageUploadProgress[selectedImageIndex] && !imageData[selectedImageIndex],
              })}
            />
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
}
