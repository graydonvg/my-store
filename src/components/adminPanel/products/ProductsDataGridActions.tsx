import { selectProductFormData } from '@/lib/redux/features/productForm/productFormSelectors';
import { clearProductFormData, setProductFormData } from '@/lib/redux/features/productForm/productFormSlice';
import { selectImageData } from '@/lib/redux/features/productImages/productImagesSelectors';
import { clearAllProductImagesData, setImageData } from '@/lib/redux/features/productImages/productImagesSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteProduct } from '@/services/admin/delete';
import { deleteAllProductImages, deleteProductImagesFromStorage } from '@/services/admin/image-deletion';
import revalidateAllData from '@/services/admin/revalidate-all-data';
import { Product, ResponseWithNoData } from '@/types';
import { DeleteForever, Edit, Preview } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Flip, Id, toast } from 'react-toastify';

type Props = {
  params: GridRenderCellParams<Product>;
};

export default function ProductsDataGridActions({ params }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const imageData = useAppSelector(selectImageData);
  const productFormData = useAppSelector(selectProductFormData);
  const { productImageData, ...restOfProductData } = params.row;
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

    dispatch(clearProductFormData());
    dispatch(clearAllProductImagesData());
    dispatch(setImageData(productImageData));
    dispatch(setProductFormData(restOfProductData));
    router.push('/admin/edit-product');
    setIsLoading(false);
  }

  async function revalidateAndRefresh() {
    setIsLoading(true);

    const data = await revalidateAllData();

    if (data.success === true) {
      router.refresh();
    } else {
      toast.error(data.message);
    }

    setIsLoading(false);
  }

  async function permanentlyDeleteProduct() {
    setIsDeletingProduct(true);

    const toastId = toast.loading('Deleting product...');

    const deleteImagesPromise = deleteProductImagesFromStorage(productImageData);
    const deleteProductDataPromise = deleteProduct(params.row.productId);

    const results = await Promise.all([deleteImagesPromise, deleteProductDataPromise]);

    const success = results.every((result) => result.success);

    handleToastUpdate(results, success, toastId);

    if (success) {
      await revalidateAndRefresh();
      router.refresh();
      setIsDeletingProduct(false);
    }

    setIsDeletingProduct(false);
  }

  function handleToastUpdate(results: ResponseWithNoData[], success: boolean, toastId: Id) {
    if (success) {
      toast.update(toastId, {
        render: 'Product deleted successfully',
        type: 'success',
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
        closeOnClick: true,
        transition: Flip,
      });
    } else {
      const errorMessages = results.filter((result) => !result.success).map((result) => result.message);

      toast.dismiss(toastId);

      errorMessages.forEach((message) => {
        toast.error(message);
      });
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', width: 1 }}>
      <Tooltip title="View product">
        <IconButton
          disabled={isLoading || isDeletingProduct}
          onClick={() =>
            router.push(
              `/products/${params.row.category?.toLowerCase()}/${params.row.name.toLowerCase().split(' ').join('-')}/${
                params.row.productId
              }`
            )
          }>
          <Preview />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit product">
        <IconButton
          disabled={isLoading || isDeletingProduct}
          onClick={editProduct}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete product">
        <IconButton
          disabled={isLoading || isDeletingProduct}
          onClick={permanentlyDeleteProduct}>
          <DeleteForever />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
