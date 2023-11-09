'use client';

import { Box, Paper, Typography } from '@mui/material';
import Image from 'next/image';
import CustomButton from './buttons/CustomButton';
import useCustomColorPalette from '@/hooks/useCustomColorPalette';
import { DeleteForever } from '@mui/icons-material';
import { usePathname, useRouter } from 'next/navigation';
import { deleteAllProductImages, formatCurrency } from '@/lib/utils';
import { AddProductStoreType, ProductType } from '@/types';
import { useAppDispatch } from '@/lib/redux/hooks';
import {
  resetFormData,
  resetImageData,
  resetProductToUpdateId,
  setFormData,
  setImageData,
  setImageUploadProgress,
  setProductToUpdateId,
} from '@/lib/redux/addProduct/addProductSlice';
import deleteProduct from '@/services/products/delete-product';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Spinner } from './progress/Spinner';

type Props = {
  product: ProductType;
};

export default function ProductCard({ product }: Props) {
  const color = useCustomColorPalette();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAdminView = pathname.includes('admin-view');
  const isOnSale = product.on_sale == 'Yes';
  const salePrice = product.price - (product.price as number) * ((product.sale_percentage as number) / 100);
  const { product_id, product_image_data, ...restOfProductData } = product;
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const imageUrl = product_image_data.filter((data) => data.index === 0)[0].image_url;

  function handleSetAddProductStoreData() {
    dispatch(resetImageData());
    dispatch(resetFormData());
    dispatch(resetProductToUpdateId());
    product_image_data.map((data) => dispatch(setImageUploadProgress({ file_name: data.file_name, progress: 100 })));
    product_image_data.map((data) => dispatch(setImageData(data)));
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

  function handleGoToProductPage() {
    dispatch(resetImageData());
    product.product_image_data.map((data) =>
      dispatch(setImageUploadProgress({ file_name: data.file_name, progress: 100 }))
    );
    product.product_image_data.map((data) => dispatch(setImageData(data)));
    router.push(`/products/product/${product.product_id}`);
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
        <Box
          onClick={handleGoToProductPage}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1, sm: 2 },
            paddingBottom: !isAdminView ? { xs: 1, sm: 2 } : null,
            cursor: 'pointer',
          }}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              // maxHeight: '208px',
              aspectRatio: 6 / 8,
            }}>
            <Image
              style={{ objectFit: 'cover', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }}
              fill
              sizes="(min-width: 1200px) 286px, (min-width: 900px) 33.21vw, calc(50vw - 20px)"
              src={imageUrl}
              alt="mens t-shirt"
              priority
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              alignSelf: 'flex-end',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}>
            {isOnSale ? (
              <Box
                sx={{
                  width: 'fit-content',
                  display: 'flex',
                  borderRadius: 1,
                  marginTop: 0.5,
                  marginRight: 0.5,
                  paddingX: 0.5,
                  backgroundColor: color.green.dark,
                }}>
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ color: color.grey.light, textTransform: 'uppercase' }}>
                  sale
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
                  {formatCurrency(salePrice)}
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
            <CustomButton
              disabled={isDeletingProduct}
              onClick={handleDeleteProduct}
              fullWidth
              label="delete"
              startIcon={isDeletingProduct ? <Spinner size={20} /> : <DeleteForever />}
              backgroundColor="red"
            />
            <CustomButton
              onClick={handleSetAddProductStoreData}
              fullWidth
              label="update"
              backgroundColor="blue"
            />
          </Box>
        ) : null}
      </Box>
    </Paper>
  );
}
