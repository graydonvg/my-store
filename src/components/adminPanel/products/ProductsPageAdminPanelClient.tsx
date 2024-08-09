'use client';

import { QueryPageDataGrid, QueryFilterDataGrid, QuerySortDataGrid, Product, ResponseWithNoData } from '@/types';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import CustomDataGrid from '../../dataGrid/CustomDataGrid';
import { useMemo, useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { Flip, Id, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { deleteProductImagesFromStorage } from '@/utils/deleteProductImages';
import ProductsDataGridToolbar from './ProductsDataGridToolbar';
import { deleteSelectedProducts } from '@/services/admin/delete';
import getProductsDataGridColumns from './getProductsDataGridColumns';

type Props = {
  products: Product[] | null;
  totalRowCount: number;
  querySuccess: boolean;
  queryMessage: string;
  page: QueryPageDataGrid;
  sort: QuerySortDataGrid;
  filter: QueryFilterDataGrid;
};

export default function ProductsPageAdminPanelClient({
  products,
  totalRowCount,
  querySuccess,
  queryMessage,
  page,
  sort,
  filter,
}: Props) {
  const router = useRouter();
  const userData = useAppSelector(selectUserData);
  const [selectedProductIds, setSelectedProductIds] = useState<GridRowSelectionModel>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const columns = getProductsDataGridColumns();
  const memoizedColumns = useMemo(() => columns, [columns]);

  function handleRowSelection(rowSelectionModel: GridRowSelectionModel) {
    setSelectedProductIds(rowSelectionModel);
  }

  async function handleDeleteProducts() {
    setIsDeleting(true);
    const productImagesToastId = toast.loading('Deleting product images...');
    const productDataToastId = toast.loading('Deleting product data...');

    const imagesToDelete = selectedProductIds
      .map((selectedProductId) => {
        const productsToDelete = products!.filter((product) => product.productId === selectedProductId);
        return productsToDelete.map((product) => product.productImageData);
      })
      .flat(2);

    const deleteProductImagesFromStoragePromise = deleteProductImagesFromStorage(imagesToDelete);
    const deleteSelectedProductsPromise = deleteSelectedProducts(selectedProductIds);

    const [deleteProductImagesFromStorageResult, deleteSelectedProductsResult] = await Promise.allSettled([
      deleteProductImagesFromStoragePromise,
      deleteSelectedProductsPromise,
    ]);

    handleToastUpdate(deleteProductImagesFromStorageResult, productImagesToastId, 'product images');
    handleToastUpdate(deleteSelectedProductsResult, productDataToastId, 'product data');

    if (
      deleteProductImagesFromStorageResult.status === 'fulfilled' &&
      deleteSelectedProductsResult.status === 'fulfilled'
    ) {
      router.refresh();
      setSelectedProductIds([]);
      setIsDeleting(false);
    }
  }

  function handleToastUpdate(result: PromiseSettledResult<ResponseWithNoData>, toastId: Id, entityType: string) {
    if (result.status === 'fulfilled') {
      const { success, message } = result.value;
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
        render: `Failed to delete ${entityType}: ${result.reason}`,
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
    <CustomDataGrid
      data={products}
      getRowId={(row) => row.productId}
      totalRowCount={totalRowCount}
      querySuccess={querySuccess}
      queryMessage={queryMessage}
      page={page}
      sort={sort}
      filter={filter}
      columns={memoizedColumns}
      onRowSelectionModelChange={handleRowSelection}
      checkboxSelection={userData?.role === 'admin' ? false : true}
      toolbar={
        <ProductsDataGridToolbar
          isDeleting={isDeleting}
          onDeleteClick={handleDeleteProducts}
          numberOfSelectedRows={selectedProductIds.length}
        />
      }
    />
  );
}
