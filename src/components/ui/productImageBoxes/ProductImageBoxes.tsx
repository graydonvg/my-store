import { useAppSelector } from '@/lib/redux/hooks';
import { Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import SmallProductImageBox from './SmallProductImageBox';
import LargeProductImageBox from './LargeProductImageBox';
import { usePathname } from 'next/navigation';
import { ProductType } from '@/types';

type EmptySmallBoxWithBorderProps = {
  show: boolean;
};

function EmptySmallBoxWithBorder({ show }: EmptySmallBoxWithBorderProps) {
  const { imageData, imageUploadProgress } = useAppSelector((state) => state.productForm);

  if (!show) return null;

  return Array.from(Array(5 - imageData.length - imageUploadProgress.length)).map((_, index) => (
    <SmallProductImageBox key={`placeholder-${index}`} />
  ));
}

type SmallImageAdminViewProps = {
  show: boolean;
  selectImage: (index: number) => void;
};

function SmallImageAdminView({ show, selectImage }: SmallImageAdminViewProps) {
  const { imageData, productFormData } = useAppSelector((state) => state.productForm);

  if (!show) return null;

  return (
    <>
      {imageData.map((data, index) => (
        <SmallProductImageBox
          key={data.fileName}
          productName={productFormData.name}
          productImageData={data}
          selectImage={() => selectImage(index)}
        />
      ))}
    </>
  );
}

type SmallImageClientViewProps = {
  show: boolean;
  product: ProductType;
  selectImage: (index: number) => void;
};

function SmallImageClientView({ show, product, selectImage }: SmallImageClientViewProps) {
  if (!show) return null;

  return (
    <>
      {product.productImageData
        .sort((a, b) => a.index - b.index)
        .map((data, index) => (
          <SmallProductImageBox
            key={data.fileName}
            productName={product?.name}
            productImageData={data}
            selectImage={() => selectImage(index)}
          />
        ))}
    </>
  );
}

type BoxWithUploadProgressProps = {
  show: boolean;
};

function BoxWithUploadProgress({ show }: BoxWithUploadProgressProps) {
  const { imageUploadProgress } = useAppSelector((state) => state.productForm);

  if (!show) return null;

  return (
    <>
      {imageUploadProgress.map((data, index) => (
        <SmallProductImageBox
          key={index}
          uploadProgressData={data}
        />
      ))}
    </>
  );
}

type ProductImageBoxesProps = { product?: ProductType };

export default function ProductImageBoxes({ product }: ProductImageBoxesProps) {
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { imageData, productFormData, imageUploadProgress } = useAppSelector((state) => state.productForm);

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
            />
            {/* Gets image from db */}
            <SmallImageClientView
              show={!isAdminView && !!product}
              product={product!}
              selectImage={handleSelectedImage}
            />
            <BoxWithUploadProgress
              show={isAdminView && imageUploadProgress.length > 0}
              // boxBorderColor={boxBorderColor}
            />
            <EmptySmallBoxWithBorder show={isAdminView} />
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
