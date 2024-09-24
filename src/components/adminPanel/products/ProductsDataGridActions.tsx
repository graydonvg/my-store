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
    const productImagesToastId = toast.loading('Deleting product images...');
    const productDataToastId = toast.loading('Deleting product data...');

    const deleteImagesPromise = deleteProductImagesFromStorage(productImageData);
    const deleteProductDataPromise = deleteProduct(params.row.productId);

    const [deleteImagesResponse, deleteProductDataResponse] = await Promise.all([
      deleteImagesPromise,
      deleteProductDataPromise,
    ]);

    handleToastUpdate(deleteImagesResponse, productImagesToastId);
    handleToastUpdate(deleteProductDataResponse, productDataToastId);

    if (deleteImagesResponse.success && deleteProductDataResponse.success) {
      await revalidateAndRefresh();
      router.refresh();
      setIsDeletingProduct(false);
    }

    setIsDeletingProduct(false);
  }

  function handleToastUpdate(response: ResponseWithNoData, toastId: Id) {
    if (response.success) {
      const { success, message } = response;
      toast.update(toastId, {
        render: message,
        type: success ? 'success' : 'error',
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
        closeOnClick: true,
        transition: Flip,
      });
    } else {
      toast.update(toastId, {
        render: response.message,
        type: 'error',
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
        closeOnClick: true,
        transition: Flip,
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
