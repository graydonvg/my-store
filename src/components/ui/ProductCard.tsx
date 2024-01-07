'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import ContainedButton from './buttons/ContainedButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { DeleteForever } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { ProductType } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { resetAllProductData, setImageData, setProductFormData } from '@/lib/redux/productForm/productFormSlice';
import deleteProduct from '@/services/products/delete-product';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatCurrency';
import { deleteAllProductImages } from '@/utils/deleteAllProductImages';
import { calculateDiscountedProductPrice } from '@/utils/calculateDiscountedPrice';
import { borderRadius } from '@/constants/styles';
import revalidate from '@/services/revalidate';

type SalePercentageBadgeProps = {
  show: boolean;
  percentage: number;
};

function SalePercentageBadge({ show, percentage }: SalePercentageBadgeProps) {
  const customColorPalette = useCustomColorPalette();

  if (!show) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: borderRadius,
        paddingX: 0.5,
        backgroundColor: customColorPalette.primary.dark,
        width: 'min-content',
      }}>
      <Typography
        component="span"
        variant="caption"
        sx={{
          textAlign: 'center',
          color: customColorPalette.typographyVariants.white,
          textTransform: 'uppercase',
        }}>
        {`${percentage}% off`}
      </Typography>
    </Box>
  );
}

type SalePriceProps = {
  show: boolean;
  price: number;
};

function SalePrice({ show, price }: SalePriceProps) {
  const customColorPalette = useCustomColorPalette();

  if (!show) return null;

  return (
    <Typography
      lineHeight={1}
      component="span"
      fontSize={16}
      fontFamily={'Georgia'}
      fontStyle="italic"
      color={customColorPalette.typographyVariants.grey}
      sx={{ textDecoration: 'line-through' }}>
      {formatCurrency(price)}
    </Typography>
  );
}

type AdminButtonsProps = {
  show: boolean;
  product: ProductType;
};

function AdminButtons({ show, product }: AdminButtonsProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { imageData } = useAppSelector((state) => state.productForm);
  const { productImageData, ...restOfProductData } = product;
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!show) return null;

  async function handleSetProductDataForUpdate() {
    setIsLoading(true);

    if (imageData && !product.productId) {
      const { success, message } = await deleteAllProductImages(imageData);
      if (success === false) {
        toast.error(message);
      }
    }

    dispatch(resetAllProductData());
    dispatch(setImageData(product.productImageData));
    dispatch(setProductFormData(restOfProductData));
    setIsLoading(false);
    router.push('/admin-view/add-product');
  }

  async function handleRevalidate() {
    const data = await revalidate('/');

    if (data.success === true) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message);
    }
  }

  async function handleDeleteProduct() {
    setIsDeletingProduct(true);

    const deleteImagesPromise = deleteAllProductImages(productImageData);
    const deleteProductPromise = deleteProduct(product.productId!);

    const [deleteImagesResult, deleteProductResult] = await Promise.all([deleteImagesPromise, deleteProductPromise]);

    const { success: deleteImagesSuccess, message: deleteImagesMessage } = deleteImagesResult;
    const { success: deleteProductSuccess, message: deleteProductMessage } = deleteProductResult;

    if (deleteImagesSuccess === true && deleteProductSuccess === true) {
      await handleRevalidate();
      toast.success('Product deleted successfully.');
    } else if (deleteImagesSuccess === false) {
      toast.error(deleteImagesMessage);
    } else if (deleteProductSuccess === false) {
      toast.error(deleteProductMessage);
    }

    setIsDeletingProduct(false);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        flexGrow: 1,
        paddingY: 1,
        gap: 1,
      }}>
      <ContainedButton
        isDisabled={isDeletingProduct}
        onClick={handleDeleteProduct}
        fullWidth
        label={isDeletingProduct ? '' : 'delete'}
        isLoading={isDeletingProduct}
        startIcon={<DeleteForever />}
        backgroundColor="red"
      />
      <ContainedButton
        isDisabled={isLoading}
        onClick={handleSetProductDataForUpdate}
        fullWidth
        label={isLoading ? '' : 'update'}
        isLoading={isLoading}
        backgroundColor="blue"
      />
    </Box>
  );
}

type ProductCardProps = {
  product: ProductType;
};

export default function ProductCard({ product }: ProductCardProps) {
  const customColorPalette = useCustomColorPalette();
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');
  const isOnSale = product.isOnSale === 'Yes';
  const discountedPrice = calculateDiscountedProductPrice(product);
  const { productImageData } = product;
  const imageUrl = productImageData[0] ? productImageData[0].imageUrl : '';

  return (
    <Box sx={{ borderRadius: borderRadius, height: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 1,
        }}>
        <Link href={`/products/product/${product.productId}`}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                aspectRatio: 25 / 36,
              }}>
              <Image
                style={{ objectFit: 'cover', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}
                fill
                sizes="(min-width: 1540px) 181px, (min-width: 1200px) 280px, (min-width: 900px) calc(33.21vw - 20px), (min-width: 600px) calc(50vw - 24px), 50vw"
                src={imageUrl}
                alt={`${product.name}`}
                priority
              />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                alignSelf: 'flex-start',
                display: 'flex',
                flexDirection: 'column',
              }}>
              <SalePercentageBadge
                show={isOnSale}
                percentage={product.salePercentage}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                paddingY: 2,
              }}>
              <Typography
                component="h4"
                fontSize={16}
                fontWeight={600}
                lineHeight={'20px'}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '1',
                  WebkitBoxOrient: 'vertical',
                }}>
                {product.name}
              </Typography>
              <Typography
                component="span"
                fontSize={14}
                lineHeight={'22px'}
                color={customColorPalette.typographyVariants.grey}>
                {product.brand}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  columnGap: 1,
                }}>
                <Typography
                  lineHeight={'24px'}
                  component="span"
                  fontFamily={'Georgia'}
                  fontStyle="italic"
                  fontSize={20}>
                  {formatCurrency(isOnSale ? discountedPrice : product.price)}
                </Typography>
                <SalePrice
                  show={isOnSale}
                  price={product.price}
                />
              </Box>
            </Box>
          </Box>
        </Link>
        <AdminButtons
          show={isAdminView}
          product={product}
        />
      </Box>
    </Box>
  );
}
