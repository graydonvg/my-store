import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { clearProductFormData, setProductFormData } from '@/lib/redux/features/productForm/productFormSlice';
import { Product } from '@/types';
import { deleteAllProductImages } from '@/utils/deleteProductImages';
import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ContainedButton from '../../ui/buttons/simple/ContainedButton';
import { DeleteForever, Edit } from '@mui/icons-material';
import { clearAllProductImagesData, setImageData } from '@/lib/redux/features/productImages/productImagesSlice';
import OutlinedButton from '../../ui/buttons/simple/OutlinedButton';
import { selectProductFormData } from '@/lib/redux/features/productForm/productFormSelectors';
import { selectImageData } from '@/lib/redux/features/productImages/productImagesSelectors';
import { deleteProduct } from '@/services/admin/delete';
import revalidateAllData from '@/services/admin/revalidate-all-data';

type Props = {
  product: Product;
};

export default function ProductCardButtonsAdminPanel({ product }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const imageData = useAppSelector(selectImageData);
  const productFormData = useAppSelector(selectProductFormData);
  const { productImageData, ...restOfProductData } = product;
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function editProduct() {
    setIsLoading(true);

    if (imageData.length > 0 && !productFormData.productId) {
      const { success, message } = await deleteAllProductImages(imageData);

      if (success === false) {
        toast.error(message);
      }
    }

    console.log(productImageData);

    dispatch(clearProductFormData());
    dispatch(clearAllProductImagesData());
    dispatch(setImageData(productImageData));
    dispatch(setProductFormData(restOfProductData));
    router.push('/admin/edit-product');
    setIsLoading(false);
  }

  async function revalidateAndRefresh() {
    const { success, message } = await revalidateAllData();

    if (success) {
      router.refresh();
    } else {
      toast.error(message);
    }
  }

  async function permanentlyDeleteProduct() {
    setIsDeletingProduct(true);

    const deleteImagesPromise = deleteAllProductImages(productImageData);
    const deleteProductPromise = deleteProduct(product.productId!);

    const [deleteImagesResult, deleteProductResult] = await Promise.all([deleteImagesPromise, deleteProductPromise]);

    const { success: deleteImagesSuccess, message: deleteImagesMessage } = deleteImagesResult;
    const { success: deleteProductSuccess, message: deleteProductMessage } = deleteProductResult;

    if (deleteImagesSuccess && deleteProductSuccess) {
      await revalidateAndRefresh();
      toast.success('Product deleted successfully');
    } else if (!deleteImagesSuccess) {
      await revalidateAndRefresh();
      toast.error(deleteImagesMessage);
    } else if (!deleteProductSuccess) {
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
        paddingTop: 1,
        gap: 1,
      }}>
      <OutlinedButton
        disabled={isLoading || isDeletingProduct}
        onClick={editProduct}
        fullWidth
        label={!isLoading ? 'edit' : ''}
        isLoading={isLoading}
        startIcon={<Edit />}
      />
      <ContainedButton
        disabled={isLoading}
        onClick={permanentlyDeleteProduct}
        fullWidth
        label={!isDeletingProduct ? 'delete' : ''}
        isLoading={isDeletingProduct}
        startIcon={<DeleteForever />}
        color="secondary"
      />
    </Box>
  );
}
