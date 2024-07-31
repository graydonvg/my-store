'use client';

import { QueryPageDataGrid, QueryFilterDataGrid, QuerySortDataGrid, Product, ResponseWithNoData } from '@/types';
import {
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  getGridDateOperators,
  getGridNumericOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';
import DatePickerForDataGridFilter from '../../dataGrid/DatePickerForDataGridFilter';
import { CONSTANTS } from '@/constants';
import CustomDataGrid from '../../dataGrid/CustomDataGrid';
import { useMemo, useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { Flip, Id, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import Image from 'next/image';
import { Box } from '@mui/material';
import { formatCurrency } from '@/utils/format';
import ProductsDataGridActions from './ProductsDataGridActions';
import { deleteProductImagesFromStorage } from '@/utils/deleteProductImages';
import ProductsDataGridToolbar from './ProductsDataGridToolbar';
import { deleteSelectedProducts } from '@/services/admin/delete';

function getColumns() {
  const columns: GridColDef<Product>[] = [
    {
      field: 'productImageData',
      headerName: 'Image',
      width: 62,
      resizable: false,
      renderCell: (params) => (
        <Box sx={{ height: 1, width: 1, paddingY: '4px' }}>
          <Box
            sx={{
              position: 'relative',
              height: 1,
              width: 1,
            }}>
            <Image
              src={params.row.productImageData[0].imageUrl}
              alt={`Image for ${params.row.name}`}
              fill
              style={{ objectFit: 'cover', borderRadius: CONSTANTS.BORDER_RADIUS }}
              sizes="42px"
            />
          </Box>
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 190,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 150,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 100,
      filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value !== 'isAnyOf'),
      type: 'singleSelect',
      valueOptions: ['Men', 'Women', 'Kids'],
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      width: 100,
      valueFormatter: (value) => formatCurrency(value),
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
    },
    {
      field: 'isOnSale',
      headerName: 'On sale',
      type: 'boolean',
      width: 80,
    },
    {
      field: 'salePercentage',
      headerName: 'Sale %',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 80,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
      renderCell: (params) =>
        params.row.salePercentage === 0 ? (
          <Box sx={{ color: (theme) => theme.palette.text.disabled }}>-</Box>
        ) : (
          params.row.salePercentage
        ),
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 160,
      renderCell: (params) => dayjs(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      filterOperators: getGridDateOperators()
        .filter((operator) => operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty')
        .map((operator) => ({
          ...operator,
          InputComponent: operator.InputComponent ? DatePickerForDataGridFilter : undefined,
        })),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 180,
      headerAlign: 'center',
      renderCell: (params: GridRenderCellParams<Product>) => <ProductsDataGridActions params={params} />,
    },
  ];
  return columns;
}

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
  const columns = getColumns();
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
      // await revalidateAndRefresh();
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
