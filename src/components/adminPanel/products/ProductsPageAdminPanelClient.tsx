'use client';

import { QueryPageDataGrid, QueryFilterDataGrid, QuerySortDataGrid, Product } from '@/types';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import CustomDataGrid from '../../dataGrid/CustomDataGrid';
import { useMemo, useState } from 'react';
import { Flip, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ProductsDataGridToolbar from './ProductsDataGridToolbar';
import getProductsDataGridColumns from './getProductsDataGridColumns';
import revalidateAllData from '@/services/admin/revalidate-all-data';
import { deleteProducts } from '@/services/admin/delete';

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
  const [selectedProductIds, setSelectedProductIds] = useState<GridRowSelectionModel>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const columns = getProductsDataGridColumns();
  const memoizedColumns = useMemo(() => columns, [columns]);

  function handleRowSelection(rowSelectionModel: GridRowSelectionModel) {
    setSelectedProductIds(rowSelectionModel);
  }

  async function revalidateAndRefresh() {
    const { success, message } = await revalidateAllData();

    if (success) {
      router.refresh();
    } else {
      toast.error(message);
    }
  }

  async function handleDeleteProducts() {
    setIsDeleting(true);

    const toastId = toast.loading('Deleting product(s)...');

    const { success, message } = await deleteProducts(selectedProductIds as number[]);

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
      checkboxSelection
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
