'use client';

import {
  OrderStatus,
  OrdersDataGrid,
  UpdateOrderSchema,
  QueryFilterDataGrid,
  QueryPageDataGrid,
  QuerySortDataGrid,
} from '@/types';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import CustomDataGrid from '../../dataGrid/CustomDataGrid';
import { Flip, toast } from 'react-toastify';
import {
  GridColDef,
  GridValidRowModel,
  getGridDateOperators,
  getGridNumericOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import DatePickerForDataGridFilter from '../../dataGrid/DatePickerForDataGridFilter';
import { formatCurrency } from '@/utils/format';
import OrdersDataGridToolbar from './OrdersDataGridToolbar';
import { getChangedDataGridValue } from '@/utils/getChangedDataGridValues';
import { getObjectKeyCount } from '@/utils/checkObject';
import { updateOrder } from '@/services/admin/update';
import { constructZodErrorMessage } from '@/utils/construct';

function getColumns(isUpdating: boolean) {
  const columns: GridColDef<OrdersDataGrid>[] = [
    {
      field: 'orderId',
      headerName: 'ID',
      width: 80,
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
      width: 160,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'orderStatus',
      headerName: 'Status',
      type: 'singleSelect',
      width: 150,
      editable: isUpdating ? false : true,
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
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      width: 120,
      valueFormatter: (value) => formatCurrency(value),
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
    },
    {
      field: 'complexOrBuilding',
      headerName: 'Complex / Building',
      width: 180,
      editable: isUpdating ? false : true,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
    },
    {
      field: 'streetAddress',
      headerName: 'Street Address',
      width: 160,
      editable: isUpdating ? false : true,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
    },
    {
      field: 'suburb',
      headerName: 'Suburb',
      width: 150,
      editable: isUpdating ? false : true,
      filterOperators: getGridStringOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
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
      field: 'postalCode',
      headerName: 'Postal Code',
      type: 'number',
      headerAlign: 'left',
      align: 'left',
      width: 130,
      editable: isUpdating ? false : true,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value !== 'isAnyOf' && operator.value !== 'isEmpty' && operator.value !== 'isNotEmpty'
      ),
      // renderCell to remove thousands comma (eg 1,234)
      renderCell: (params) => params.row.postalCode,
    },
    {
      field: 'recipientFirstName',
      headerName: 'Recipient first name',
      width: 180,
      editable: isUpdating ? false : true,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'recipientLastName',
      headerName: 'Recipient last name',
      width: 180,
      editable: isUpdating ? false : true,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
    {
      field: 'recipientContactNumber',
      headerName: 'Recipient contact number',
      width: 180,
      editable: isUpdating ? false : true,
      filterOperators: getGridStringOperators().filter((operator) => operator.value !== 'isAnyOf'),
    },
  ];
  return columns;
}

type Props = {
  orders: OrdersDataGrid[] | null;
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
    const validation = UpdateOrderSchema.safeParse(newRow);

    if (!validation.success) {
      const errorMessage = constructZodErrorMessage(validation.error);

      toast.error(errorMessage);

      return oldRow;
    }

    const changedValue = getChangedDataGridValue(validation.data, oldRow);
    const objectKeyCount = getObjectKeyCount(changedValue);

    if (objectKeyCount === 0) {
      return oldRow;
    }

    setIsUpdating(true);
    const toastId = toast.loading('Updating order...');

    const { success, message } = await updateOrder({ ...changedValue, orderId: oldRow.orderId });

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
    toast.error('Failed to process update. An unexpected error occured.');
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
      toolbar={<OrdersDataGridToolbar />}
    />
  );
}
