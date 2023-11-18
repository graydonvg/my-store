'use client';

import { Box, Paper, Typography } from '@mui/material';
import Image from 'next/image';
import ContainedButton from './buttons/ContainedButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { DeleteForever } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { deleteAllProductImages, formatCurrency } from '@/lib/utils';
import { AddProductStoreType, ProductType } from '@/types';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  resetAllProductData,
  setFormData,
  setImageData,
  setImageUploadProgress,
  setProductToUpdateId,
} from '@/lib/redux/addProduct/addProductSlice';
import deleteProduct from '@/services/products/delete-product';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Link from 'next/link';

type Props = {
  product: ProductType;
};

export default function ProductCard({ product }: Props) {
  const color = useCustomColorPalette();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { imageData, productToUpdateId } = useAppSelector((state) => state.addProduct);
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const isOnSale = product.on_sale === 'Yes';
  const sale_price = product.price - (product.price as number) * ((product.sale_percentage as number) / 100);
  const { product_id, product_image_data, ...restOfProductData } = product;
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageUrl = product_image_data[0] ? product_image_data[0].image_url : '';

  async function handlePrepareProductForUpdate() {
    setIsLoading(true);

    if (imageData && !productToUpdateId) {
      await deleteAllProductImages(imageData);
    }

    dispatch(resetAllProductData());
    dispatch(setImageData(product.product_image_data));
    dispatch(setProductToUpdateId(product_id));

    for (const key in restOfProductData) {
      if (key === 'sizes') {
        restOfProductData['sizes'].map((size) => dispatch(setFormData({ field: 'sizes', value: size })));
      } else {
        dispatch(
          setFormData({
            field: key as keyof AddProductStoreType,
            value: restOfProductData[key as keyof AddProductStoreType],
          })
        );
      }
    }

    setIsLoading(false);
    router.push('/admin-view/add-product');
  }

  async function handleDeleteProduct() {
    setIsDeletingProduct(true);

    try {
      const deleteImagesPromise = deleteAllProductImages(product_image_data);
      const deleteProductPromise = deleteProduct(product_id);
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
      sx={{ borderRadius: 1, height: 1 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 1, sm: 2 },
          height: 1,
        }}>
        <Link href={`/products/product/${product.product_id}`}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 1, sm: 2 },
              paddingBottom: !isAdminView ? { xs: 1, sm: 2 } : null,
            }}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                aspectRatio: 3 / 4,
              }}>
              <Image
                style={{ objectFit: 'cover', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}
                fill
                sizes="(min-width: 1540px) 181px, (min-width: 1200px) 280px, (min-width: 900px) calc(33.21vw - 20px), (min-width: 600px) calc(50vw - 24px), 50vw"
                src={imageUrl}
                alt={`Image of ${product.name}`}
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
                    borderRadius: 1,
                    paddingX: 0.5,
                    backgroundColor: color.blue.dark,
                    width: 'min-content',
                  }}>
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{
                      textAlign: 'center',
                      color: color.grey.light,
                      textTransform: 'uppercase',
                    }}>
                    {`${product.sale_percentage}% off`}
                  </Typography>
                </Box>
              ) : null}
              {/* <Box
              sx={{
                display: 'flex',
                borderRadius: 1,
                marginTop: 0.5,
                marginRight: 0.5,
                paddingX: 0.5,
                backgroundColor: orange[700],
              }}>
              <Typography
                component="span"
                variant="caption"
                sx={{ color: color.grey.light, textTransform: 'uppercase' }}>
                low stock
              </Typography>
            </Box> */}
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                paddingX: { xs: 1, sm: 2 },
              }}>
              <Typography
                component="h3"
                variant="h6">
                {product.name}
              </Typography>
              {isOnSale ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                  }}>
                  <Typography
                    sx={{ paddingRight: 1 }}
                    component="span"
                    variant="h5">
                    {formatCurrency(sale_price)}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{ textDecoration: 'line-through', opacity: '70%' }}>
                    {formatCurrency(product.price)}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  component="span"
                  variant="h5">
                  {formatCurrency(product.price)}
                </Typography>
              )}
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
              gap: { xs: 1, sm: 2 },
              paddingX: { xs: 1, sm: 2 },
              paddingBottom: { xs: 1, sm: 2 },
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
              onClick={handlePrepareProductForUpdate}
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
