import DatePickerForDataGridFilter from '@/components/dataGrid/DatePickerForDataGridFilter';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/formatting';
import { Box } from '@mui/material';
import {
  GridColDef,
  GridRenderCellParams,
  getGridDateOperators,
  getGridNumericOperators,
  getGridSingleSelectOperators,
  getGridStringOperators,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import ProductsDataGridActions from './ProductsDataGridActions';
import Image from 'next/image';
import { CONSTANTS } from '@/constants';

export default function getProductsDataGridColumns() {
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
      width: 110,
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
      headerAlign: 'center',
      width: 100,
    },
    {
      field: 'salePercentage',
      headerName: 'Sale %',
      type: 'number',
      headerAlign: 'center',
      align: 'center',
      width: 100,
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
