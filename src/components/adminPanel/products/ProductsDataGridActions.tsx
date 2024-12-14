import CustomTooltip from '@/components/ui/CustomTooltip';
import { selectProductFormData } from '@/lib/redux/features/productForm/productFormSelectors';
import { clearProductFormData, setProductFormData } from '@/lib/redux/features/productForm/productFormSlice';
import { selectImageData } from '@/lib/redux/features/productImages/productImagesSelectors';
import { clearAllProductImagesData, setImageData } from '@/lib/redux/features/productImages/productImagesSlice';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { deleteProductImages, deleteProducts } from '@/services/admin/delete';
import revalidateAllData from '@/services/admin/revalidate-all-data';
import { Product } from '@/types';
import { DeleteForever, Edit, Preview } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Flip, toast } from 'react-toastify';

type Props = {
  params: GridRenderCellParams<Product>;
};

export default function ProductsDataGridActions({ params }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userData = useAppSelector(selectUserData);
  const imageData = useAppSelector(selectImageData);
  const productFormData = useAppSelector(selectProductFormData);
  const { productImageData, ...restOfProductData } = params.row;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function editProduct() {
    setIsLoading(true);

    if (imageData.length > 0 && !productFormData.productId) {
      // Image data is persisted. This deletes any images that were uploaded but not used before clearing the store.
      // Unless changes were saved, an image will not have an ID.
      const fileNames = imageData
        .filter((item) => item.productImageId === undefined)
        .map((item) => ({ fileName: item.fileName }));

      const { success, message } = await deleteProductImages(fileNames);

      if (!success) {
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

    const result = await revalidateAllData();

    if (result.success) {
      router.refresh();
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  }

  async function permanentlyDeleteProduct() {
    setIsDeleting(true);

    const toastId = toast.loading('Deleting product...');

    const { success, message } = await deleteProducts([params.row.productId]);

    if (success) {
      toast.update(toastId, {
        render: message,
        type: 'success',
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
        closeOnClick: true,
        transition: Flip,
      });
      await revalidateAndRefresh();
    } else {
      toast.update(toastId, {
        render: message,
        type: 'error',
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
        closeOnClick: true,
        transition: Flip,
      });
    }

    setIsDeleting(false);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', width: 1 }}>
      <CustomTooltip title="View product">
        <span>
          <IconButton
            disabled={isLoading || isDeleting}
            onClick={() =>
              router.push(
                `/products/${params.row.category?.toLowerCase()}/${params.row.name
                  .toLowerCase()
                  .split(' ')
                  .join('-')}/${params.row.productId}`
              )
            }>
            <Preview />
          </IconButton>
        </span>
      </CustomTooltip>
      <CustomTooltip title="Edit product">
        <span>
          <IconButton
            disabled={
              isLoading || isDeleting || (params.row.createdBy !== userData?.userId && userData?.role !== 'owner')
            }
            onClick={editProduct}>
            <Edit />
          </IconButton>
        </span>
      </CustomTooltip>
      <CustomTooltip title="Delete product">
        <span>
          <IconButton
            disabled={
              isLoading || isDeleting || (params.row.createdBy !== userData?.userId && userData?.role !== 'owner')
            }
            onClick={permanentlyDeleteProduct}>
            <DeleteForever />
          </IconButton>
        </span>
      </CustomTooltip>
    </Box>
  );
}
