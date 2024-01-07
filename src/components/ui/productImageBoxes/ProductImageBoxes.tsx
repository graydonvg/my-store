import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { useAppSelector } from '@/lib/redux/hooks';
import { Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import SmallProductImageBox from './SmallProductImageBox';
import LargeProductImageBox from './LargeProductImageBox';
import { usePathname } from 'next/navigation';
import { ProductType } from '@/types';

type EmptySmallBoxWithBorderProps = {
  show: boolean;
  isEditMode?: boolean;
};

function EmptySmallBoxWithBorder({ show, isEditMode }: EmptySmallBoxWithBorderProps) {
  const { imageData, imageUploadProgress } = useAppSelector((state) => state.productForm);

  if (!show) return;

  return Array.from(Array(5 - imageData.length - imageUploadProgress.length)).map((_, index) => (
    <SmallProductImageBox
      key={`placeholder-${index}`}
      isEditMode={isEditMode}
    />
  ));
}

type SmallImageAdminViewProps = {
  show: boolean;
  isEditMode?: boolean;
  selectImage: (index: number) => void;
  selectedImageIndex: number;
};

function SmallImageAdminView({ show, isEditMode, selectImage, selectedImageIndex }: SmallImageAdminViewProps) {
  const { imageData, productFormData } = useAppSelector((state) => state.productForm);

  if (!show) return;

  return (
    <>
      {imageData.map((data, index) => (
        <SmallProductImageBox
          key={data.fileName}
          productName={productFormData.name}
          productImageData={data}
          imageIndex={index}
          isEditMode={isEditMode}
          selectImage={() => selectImage(index)}
          selectedImageIndex={selectedImageIndex}
        />
      ))}
    </>
  );
}

type SmallImageClientViewProps = {
  show: boolean;
  product: ProductType;
  isEditMode?: boolean;
  selectImage: (index: number) => void;
  selectedImageIndex: number;
};

function SmallImageClientView({
  show,
  product,
  isEditMode,
  selectImage,
  selectedImageIndex,
}: SmallImageClientViewProps) {
  if (!show) return;

  return (
    <>
      {product.productImageData.map((data, index) => (
        <SmallProductImageBox
          key={data.fileName}
          productName={product?.name}
          productImageData={data}
          imageIndex={index}
          isEditMode={isEditMode}
          selectImage={() => selectImage(index)}
          selectedImageIndex={selectedImageIndex}
        />
      ))}
    </>
  );
}

type BoxWithUploadProgressProps = {
  show: boolean;
  isEditMode?: boolean;
};

function BoxWithUploadProgress({ show, isEditMode }: BoxWithUploadProgressProps) {
  const { imageUploadProgress } = useAppSelector((state) => state.productForm);

  if (!show) return;

  return (
    <>
      {imageUploadProgress.map((data, index) => (
        <SmallProductImageBox
          key={index}
          isEditMode={isEditMode}
          uploadProgressData={data}
        />
      ))}
    </>
  );
}

type ProductImageBoxesProps = { isEditMode?: boolean; product?: ProductType };

export default function ProductImageBoxes({ isEditMode, product }: ProductImageBoxesProps) {
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { imageData, productFormData, imageUploadProgress } = useAppSelector((state) => state.productForm);
  const customColorPalette = useCustomColorPalette();
  const boxBorderColor = isAdminView ? customColorPalette.textField.border : 'transparent';

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
            {/* Gets image from store */}
            <SmallImageAdminView
              show={isAdminView}
              selectImage={handleSelectedImage}
              selectedImageIndex={selectedImageIndex}
              isEditMode={isEditMode}
            />
            {/* Gets image from db */}
            <SmallImageClientView
              show={!isAdminView && !!product}
              product={product!}
              selectImage={handleSelectedImage}
              selectedImageIndex={selectedImageIndex}
              isEditMode={isEditMode}
            />
            <BoxWithUploadProgress
              show={isAdminView && imageUploadProgress.length > 0}
              // boxBorderColor={boxBorderColor}
              isEditMode={isEditMode}
            />
            <EmptySmallBoxWithBorder
              show={isAdminView}
              isEditMode={isEditMode}
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={10}
          sx={{ order: { xs: 1, sm: 2 } }}>
          {isAdminView ? (
            // Gets image from store
            <LargeProductImageBox
              productName={productFormData.name}
              productImageData={imageData[selectedImageIndex]}
              selectedImageIndex={selectedImageIndex}
            />
          ) : (
            // Gets image from db
            <LargeProductImageBox
              productName={product?.name ?? ''}
              productImageData={product?.productImageData[selectedImageIndex]}
              selectedImageIndex={selectedImageIndex}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
