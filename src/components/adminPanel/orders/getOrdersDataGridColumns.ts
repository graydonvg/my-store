import DatePickerForDataGridFilter from '@/components/dataGrid/DatePickerForDataGridFilter';
import { OrderStatus, OrdersDataGrid } from '@/types';
import { formatCurrency } from '@/utils/format';
import {
  GridColDef,
  getGridDateOperators,
  getGridNumericOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';

export default function getOrdersDataGridColumns(isUpdating: boolean) {
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