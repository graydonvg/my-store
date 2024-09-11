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
import revalidateAllData from '@/services/admin/revalidate-all-data';

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

  async function revalidateAndRefresh() {
    const data = await revalidateAllData();

    if (data.success === true) {
      router.refresh();
    } else {
      toast.error(data.message);
    }
  }

  async function handleDeleteProducts() {
    setIsDeleting(true);

    // Show a single toast for the entire delete operation
    const productToastId = toast.loading('Deleting product...');

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

    handleToastUpdate([deleteProductImagesFromStorageResult, deleteSelectedProductsResult], productToastId);

    await revalidateAndRefresh();
    setSelectedProductIds([]);
    setIsDeleting(false);
  }

  function handleToastUpdate(results: PromiseSettledResult<ResponseWithNoData>[], toastId: Id) {
    const hasError = results.some((result) => result.status === 'rejected' || !result.value.success);

    if (!hasError) {
      toast.update(toastId, {
        render: 'Product deleted successfully.',
        type: 'success',
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
        closeOnClick: true,
        transition: Flip,
      });
    } else {
      const errorMessage = results
        .filter((result) => result.status === 'rejected' || !result.value.success)
        .map((result) => (result.status === 'rejected' ? result.reason : result.value.message))
        .join('. ');

      toast.update(toastId, {
        render: errorMessage,
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
