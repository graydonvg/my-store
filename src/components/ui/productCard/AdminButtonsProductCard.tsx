import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { clearProductFormData, setProductFormData } from '@/lib/redux/slices/productFormSlice';
import deleteProduct from '@/services/products/delete';
import revalidate from '@/services/revalidate';
import { ProductType } from '@/types';
import { deleteAllProductImages } from '@/utils/deleteAllProductImages';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ContainedButton from '../buttons/ContainedButton';
import { DeleteForever, Edit } from '@mui/icons-material';
import { clearAllProductImagesData, setImageData } from '@/lib/redux/slices/productImagesSlice';
import OutlinedButton from '../buttons/OutlinedButton';

type Props = {
  product: ProductType;
};

export default function AdminButtonsProductCard({ product }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { imageData } = useAppSelector((state) => state.productImages);
  const { productId } = useAppSelector((state) => state.productForm.productFormData);
  const { productImageData, ...restOfProductData } = product;
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function editProduct() {
    setIsLoading(true);

    if (imageData.length > 0 && !productId) {
      const { success, message } = await deleteAllProductImages(imageData);

      if (success === false) {
        toast.error(message);
      }
    }

    dispatch(clearProductFormData());
    dispatch(clearAllProductImagesData());
    dispatch(setImageData(product.productImageData));
    dispatch(setProductFormData(restOfProductData));
    router.push('/admin/edit-product');
    setIsLoading(false);
  }

  async function revalidateAndRefresh() {
    const data = await revalidate('/');

    if (data.success === true) {
      toast.success(data.message);
      router.refresh();
    } else {
      toast.error(data.message);
    }
  }

  async function permanentlyDeleteProduct() {
    setIsDeletingProduct(true);

    const deleteImagesPromise = deleteAllProductImages(productImageData);
    const deleteProductPromise = deleteProduct(product.productId!);

    const [deleteImagesResult, deleteProductResult] = await Promise.all([deleteImagesPromise, deleteProductPromise]);

    const { success: deleteImagesSuccess, message: deleteImagesMessage } = deleteImagesResult;
    const { success: deleteProductSuccess, message: deleteProductMessage } = deleteProductResult;

    if (deleteImagesSuccess === true && deleteProductSuccess === true) {
      await revalidateAndRefresh();
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
        disabled={isDeletingProduct || isLoading}
        onClick={permanentlyDeleteProduct}
        fullWidth
        label={!isDeletingProduct ? 'delete' : ''}
        isLoading={isDeletingProduct}
        startIcon={<DeleteForever />}
        backgroundColor="warning"
      />
      <OutlinedButton
        disabled={isLoading || isDeletingProduct}
        onClick={editProduct}
        fullWidth
        label={!isLoading ? 'edit' : ''}
        isLoading={isLoading}
        startIcon={<Edit />}
      />
    </Box>
  );
}
