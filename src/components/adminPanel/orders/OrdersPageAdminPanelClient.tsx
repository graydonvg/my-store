'use client';

import {
  OrderStatusEnum,
  OrdersDataGridDataAdmin,
  QueryFilterDataGrid,
  QueryPageDataGrid,
  QuerySortDataGrid,
  UpdateOrderAdminDb,
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
import { getNumberOfFormFields } from '@/utils/checkForms';
import { updateOrder } from '@/services/admin/update';
import { ordersDataGridNewRowSchema } from '@/schemas/ordersDataGridNewRowSchema';

function getColumns(isUpdating: boolean) {
  const columns: GridColDef<OrdersDataGridDataAdmin>[] = [
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
      field: 'complexOrBuilding',
      headerName: 'Complex / Building',
      width: 160,
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
      ] as OrderStatusEnum[],
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
    const validation = ordersDataGridNewRowSchema.safeParse(newRow);

    if (!validation.success) {
      validation.error.issues.forEach((issue) => toast.error(issue.message));

      return oldRow;
    }

    const changedValue = getChangedDataGridValue(newRow, oldRow);
    const numberOfFieldsToUpdate = getNumberOfFormFields(changedValue);

    if (numberOfFieldsToUpdate === 0) {
      return oldRow;
    }

    const changedValueWithOrderId: UpdateOrderAdminDb = { ...changedValue, orderId: oldRow.orderId };

    setIsUpdating(true);
    const toastId = toast.loading('Updating order...');

    const { success, message } = await updateOrder(changedValueWithOrderId);

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
      toolbar={<OrdersDataGridToolbar />}
    />
  );
}
