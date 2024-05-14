'use client';

import {
  OrderStatus,
  OrdersDataGridDataAdmin,
  QueryFilterDataGrid,
  QueryPageDataGrid,
  QuerySortDataGrid,
  UpdateOrderAdminDb,
} from '@/types';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import CustomDataGrid from '../dataGrid/CustomDataGrid';
import { Flip, toast } from 'react-toastify';
import {
  GridColDef,
  GridValidRowModel,
  getGridDateOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import DatePickerForDataGridFilter from '../dataGrid/DatePickerForDataGridFilter';
import { formatCurrency } from '@/utils/formatCurrency';
import OrdersDataGridToolbarAdminPanel from '../dataGrid/OrdersDataGridToolbarAdminPanel';
import { getChangedDataGridValues } from '@/utils/getChangedDataGridValues';
import { getNumberOfFormFields } from '@/utils/getNumberOfFormFields';
import { updateOrderAdmin } from '@/services/admin/update';

function getColumns(isUpdating: boolean) {
  const columns: GridColDef<OrdersDataGridDataAdmin>[] = [
    {
      field: 'orderId',
      headerName: 'ID',
      width: 300,
      sortable: false,
      filterOperators: getGridStringOperators().filter((operator) => operator.value === 'equals'),
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
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'contactNumber',
      headerName: 'Contact number',
      width: 150,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'recipientFirstName',
      headerName: 'Recipient first name',
      width: 150,
      editable: isUpdating ? false : true,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'recipientLastName',
      headerName: 'Recipient last name',
      width: 150,
      editable: isUpdating ? false : true,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'recipientContactNumber',
      headerName: 'Recipient contact number',
      width: 150,
      editable: isUpdating ? false : true,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'province',
      headerName: 'Province',
      width: 150,
      editable: isUpdating ? false : true,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
    },
    {
      field: 'city',
      headerName: 'City',
      width: 150,
      editable: isUpdating ? false : true,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
    },
    {
      field: 'orderStatus',
      headerName: 'Status',
      width: 150,
      editable: isUpdating ? false : true,
      type: 'singleSelect',
      valueOptions: [
        'awaiting payment',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'returned',
        'refunded',
      ] as OrderStatus[],
      filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'orderTotal',
      headerName: 'Order total',
      width: 100,
      valueFormatter: (value) => formatCurrency(value),
      filterOperators: getGridSingleSelectOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
  ];
  return columns;
}

type Props = {
  orders: OrdersDataGridDataAdmin[] | null;
  totalRowCount: number;
  querySuccess: boolean;
  queryMessage: string;
  page: QueryPageDataGrid;
  sort: QuerySortDataGrid;
  filter: QueryFilterDataGrid;
};

export default function OrdersPageAdminPanelClient({
  orders,
  totalRowCount,
  querySuccess,
  queryMessage,
  page,
  sort,
  filter,
}: Props) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const columns = getColumns(isUpdating);
  const memoizedColumns = useMemo(() => columns, [columns]);

  async function handleRowUpdate(newRow: GridValidRowModel, oldRow: GridValidRowModel) {
    const changedValues = getChangedDataGridValues(newRow, oldRow);
    const numberOfFormFields = getNumberOfFormFields(changedValues);

    if (numberOfFormFields === 0) {
      return oldRow;
    }

    const modifiedChangedValues: UpdateOrderAdminDb = { ...changedValues, orderId: oldRow.orderId };

    setIsUpdating(true);
    const toastId = toast.loading('Updating order...');

    const { success, message } = await updateOrderAdmin(modifiedChangedValues);

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
      setIsUpdating(false);
      router.refresh();
      return newRow;
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
      setIsUpdating(false);
      return oldRow;
    }
  }

  function handleRowUpdateError(_error: unknown) {
    // Axiom error log
    toast.error('Failed to process update. An unexpected data grid error occured.');
  }

  return (
    <CustomDataGrid
      data={orders}
      getRowId={(row) => row.orderId}
      totalRowCount={totalRowCount}
      querySuccess={querySuccess}
      queryMessage={queryMessage}
      page={page}
      sort={sort}
      filter={filter}
      columns={memoizedColumns}
      processRowUpdate={handleRowUpdate}
      onProcessRowUpdateError={handleRowUpdateError}
      toolbar={<OrdersDataGridToolbarAdminPanel />}
    />
  );
}
