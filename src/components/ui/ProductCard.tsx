'use client';

import { Box, Paper, Typography } from '@mui/material';
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
import { calculateDiscountedPrice } from '@/utils/calculateDiscountedPrice';
import { borderRadius } from '@/constants/styles';

type Props = {
  product: ProductType;
};

export default function ProductCard({ product }: Props) {
  const customColorPalette = useCustomColorPalette();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { imageData } = useAppSelector((state) => state.productForm);
  const pathname = usePathname();
  const isAdminView = pathname.includes('/admin-view');
  const isOnSale = product.on_sale === 'Yes';
  const discountedPrice = calculateDiscountedPrice(product);
  const { product_image_data, ...restOfProductData } = product;
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageUrl = product_image_data[0] ? product_image_data[0].image_url : '';

  async function handleSetProductDataForUpdate() {
    setIsLoading(true);
    if (imageData && !product.product_id) {
      const { success, message } = await deleteAllProductImages(imageData);
      if (success === false) {
        toast.error(message);
      }
    }
    dispatch(resetAllProductData());
    dispatch(setImageData(product.product_image_data));
    dispatch(setProductFormData(restOfProductData));
    setIsLoading(false);
    router.push('/admin-view/add-product');
  }

  async function handleDeleteProduct() {
    setIsDeletingProduct(true);
    try {
      const deleteImagesPromise = deleteAllProductImages(product_image_data);
      const deleteProductPromise = deleteProduct(product.product_id!);
      const [deleteImagesResult, deleteProductResult] = await Promise.all([deleteImagesPromise, deleteProductPromise]);
      const { success: deleteImagesSuccess, message: deleteImagesMessage } = deleteImagesResult;
      const { success: deleteProductSuccess, message: deleteProductMessage } = deleteProductResult;
      if (deleteImagesSuccess === true && deleteProductSuccess === true) {
        toast.success('Product deleted successfully.');
      } else if (deleteImagesSuccess === false) {
        toast.error(deleteImagesMessage);
      } else if (deleteProductSuccess === false) {
        toast.error(deleteProductMessage);
      }
    } catch (error) {
      toast.error('An unexpected error occured.');
    } finally {
      setIsDeletingProduct(false);
    }
  }

  return (
    <Paper
      elevation={1}
      sx={{ borderRadius: borderRadius, height: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 1,
        }}>
        <Link href={`/products/product/${product.product_id}`}>
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
              {isOnSale ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: borderRadius,
                    paddingX: 0.5,
                    backgroundColor: customColorPalette.blue.dark,
                    width: 'min-content',
                  }}>
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      textAlign: 'center',
                      color: customColorPalette.grey.light,
                      textTransform: 'uppercase',
                    }}>
                    {`${product.sale_percentage}% off`}
                  </Typography>
                </Box>
              ) : null}
              {/* <Box
              sx={{
                display: 'flex',
                borderRadius: borderRadius,
                marginTop: 0.5,
                marginRight: 0.5,
                paddingX: 0.5,
                backgroundColor: orange[700],
              }}>
              <Typography
                component="span"
                variant="caption"
                sx={{ color: customColorPalette.grey.light, textTransform: 'uppercase' }}>
                low stock
              </Typography>
            </Box> */}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                paddingX: 1,
                paddingY: 2,
                gap: 1,
              }}>
              <Typography
                component="h4"
                variant="h4"
                fontSize={15}
                fontWeight={600}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '1',
                  WebkitBoxOrient: 'vertical',
                }}>
                {product.name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: 0.5,
                }}>
                <Typography
                  lineHeight={1}
                  sx={{ paddingRight: 0.5 }}
                  component="span"
                  fontFamily={'Georgia'}
                  fontStyle="italic"
                  fontSize={18}>
                  {formatCurrency(isOnSale ? discountedPrice : product.price)}
                </Typography>
                {isOnSale ? (
                  <Typography
                    lineHeight={1}
                    component="span"
                    fontSize={16}
                    fontFamily={'Georgia'}
                    fontStyle="italic"
                    sx={{ textDecoration: 'line-through', opacity: '50%' }}>
                    {formatCurrency(product.price)}
                  </Typography>
                ) : null}
              </Box>
            </Box>
          </Box>
        </Link>
        {isAdminView ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              flexGrow: 1,
              padding: 1,
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
        ) : null}
      </Box>
    </Paper>
  );
}
