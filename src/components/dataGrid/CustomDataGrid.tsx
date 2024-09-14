'use client';

import { Box, tablePaginationClasses, useMediaQuery, useTheme } from '@mui/material';
import { QueryPageDataGrid, QueryFilterDataGrid, QuerySortDataGrid } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DataGrid,
  DataGridProps,
  GridFilterModel,
  GridPaginationModel,
  GridSortDirection,
  GridSortModel,
  gridClasses,
} from '@mui/x-data-grid';
import { ReactNode, useEffect, useMemo } from 'react';
import CustomNoRowsOverlay from './CustomNoRowsOverlay';
import { toast } from 'react-toastify';
import { calculatePagination } from '@/utils/calculate';

type Props = {
  data: {}[] | null;
  totalRowCount: number;
  querySuccess: boolean;
  queryMessage: string;
  page: QueryPageDataGrid;
  sort: QuerySortDataGrid;
  filter: QueryFilterDataGrid;
  toolbar?: ReactNode;
} & DataGridProps;

export default function CustomDataGrid({
  data,
  totalRowCount,
  querySuccess,
  queryMessage,
  page,
  sort,
  filter,
  toolbar,
  ...dataGridProps
}: Props) {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newSearchParams = useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const dataGridCurrentPageNumber = page.number - 1;
  const rowsPerPageOptionsSet = new Set([page.rows, 5, 10, 25, 50, 100]);
  const rowsPerPageOptionsArraySorted = Array.from(rowsPerPageOptionsSet).sort((a, b) => a - b);
  const { isEndOfData, lastPageNumber } = calculatePagination(data, page, totalRowCount);
  const isBelowSmall = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (!querySuccess) {
      toast.error(queryMessage);
    }
  }, [querySuccess, queryMessage]);

  function changePage(newPage: number) {
    newSearchParams.set('page', `${newPage + 1}`);

    router.push(`?${newSearchParams}`);
  }

  function changeRowsPerPage(newRowsPerPage: number) {
    const queryStart = dataGridCurrentPageNumber * newRowsPerPage;

    // Check if the newRowsPerPage will result in an empty page
    if (queryStart >= totalRowCount) {
      const maxValidPage = Math.ceil(totalRowCount / newRowsPerPage);

      newSearchParams.set('page', `${maxValidPage}`);
    }

    newSearchParams.set('per_page', `${newRowsPerPage}`);

    router.push(`?${newSearchParams}`);
  }

  function handlePaginationModelChange(model: GridPaginationModel) {
    changePage(model.page);

    if (model.pageSize !== page.rows) {
      changeRowsPerPage(model.pageSize);
    }
  }

  function goToLastPage() {
    newSearchParams.set('page', `${lastPageNumber}`);

    router.push(`?${newSearchParams}`);
  }

  function handleSort(sortModel: GridSortModel) {
    const sortData = sortModel[0];

    if (sortData) {
      const sortField = sortData.field;
      const sortDirection = sortData.sort;

      newSearchParams.set('sort_by', `${sortField}`);
      newSearchParams.set('sort', `${sortDirection}`);
    } else {
      newSearchParams.delete('sort_by');
      newSearchParams.delete('sort');
    }

    router.push(`?${newSearchParams}`, { scroll: false });
  }

  function handleFilter(filterModel: GridFilterModel) {
    const filterData = filterModel.items.length > 0 ? filterModel.items[0] : null;

    const previousFilterValue = filter.value;

    // isEmpty and isNotEmpty have no values
    if (
      previousFilterValue ||
      (!previousFilterValue && filterData?.operator == 'isEmpty') ||
      filterData?.operator === 'isNotEmpty'
    ) {
      // Cannot access delete button event independently.
      // Delete button on filter clears filter value.
      // This removes the filter query string if the value changes or is removed.
      // Create a custom filter panel in future to access click events.
      newSearchParams.delete('col');
      newSearchParams.delete('op');
      newSearchParams.delete('val');

      router.push(`?${newSearchParams}`, { scroll: false });
    }

    if (!filterData) return;

    // isEmpty and isNotEmpty have no values
    if (!filterData.value && filterData?.operator !== 'isEmpty' && filterData?.operator !== 'isNotEmpty') return;

    newSearchParams.set('col', `${filterData.field}`);
    newSearchParams.set('op', `${filterData.operator}`);
    newSearchParams.set('val', `${filterData.value}`);

    router.push(`?${newSearchParams}`, { scroll: false });
  }

  return (
    <Box
      sx={{
        borderRadius: 0,
        // subtract navbar height
        height: 'calc(100dvh - 64px)',
        width: 1,
        overflow: 'hidden !important',
      }}>
      <DataGrid
        rows={data ?? []}
        rowCount={totalRowCount}
        pageSizeOptions={rowsPerPageOptionsArraySorted}
        disableRowSelectionOnClick
        pagination
        paginationMode="server"
        paginationModel={{ page: dataGridCurrentPageNumber, pageSize: page.rows }}
        onPaginationModelChange={handlePaginationModelChange}
        filterMode="server"
        onFilterModelChange={handleFilter}
        sortingMode="server"
        sortingOrder={['desc', 'asc']}
        sortModel={[{ field: sort.column, sort: sort.direction as GridSortDirection }]}
        onSortModelChange={handleSort}
        showCellVerticalBorder
        showColumnVerticalBorder
        disableColumnMenu
        scrollbarSize={16}
        initialState={{ density: isBelowSmall ? 'compact' : 'standard' }}
        slots={{
          toolbar: () => toolbar,
          noResultsOverlay: () => <CustomNoRowsOverlay text="No results found." />,
          noRowsOverlay: () => <CustomNoRowsOverlay text="No results found." />,
        }}
        slotProps={{
          panel: {
            sx: {
              [`& .${gridClasses.paper}`]: { minWidth: 'unset', maxWidth: 'calc(100vw - 4px)' },
              [`& .${gridClasses.panelWrapper}`]: { maxWidth: 'calc(100vw - 4px)' },
            },
          },

          columnsManagement: { autoFocusSearchField: false },
          filterPanel: {
            filterFormProps: {
              columnInputProps: { sx: { maxWidth: '150px' } },
              operatorInputProps: { sx: { maxWidth: '130px', width: 1 } },
              valueInputProps: {
                sx: { maxWidth: '190px' },
              },
            },
          },

          pagination: {
            showFirstButton: true,
            showLastButton: true,
            labelRowsPerPage: 'Rows:',
            slotProps: {
              actions: {
                nextButton: {
                  disabled: isEndOfData,
                },
                lastButton: {
                  disabled: isEndOfData,
                  onClick: goToLastPage,
                },
              },
            },
            sx: {
              [`& .${tablePaginationClasses.toolbar}`]: { paddingX: { xs: 0.5, sm: 3 } },
              [`& .${tablePaginationClasses.selectLabel}`]: { display: 'block' },
              [`& .${tablePaginationClasses.input}`]: {
                display: 'inline-flex',
                marginRight: { xs: '20px', sm: 4 },
              },
              [`& .${tablePaginationClasses.actions}`]: { marginLeft: { xs: '12px', sm: '20px' } },
            },
          },
        }}
        sx={{
          border: 'none',
          '--unstable_DataGrid-radius': 0,

          [`& .${gridClasses['scrollbar--vertical']}`]: { display: 'block' },

          [`& .${gridClasses.booleanCell}[data-value="true"]`]: {
            color: theme.palette.success.main,
          },

          [`& .${gridClasses.booleanCell}[data-value="false"]`]: {
            color: theme.palette.error.main,
          },

          [`& .${gridClasses.scrollbarFiller}`]: {
            display: 'none',
          },

          [`& .${gridClasses.toolbarContainer}`]: {
            paddingRight: 2,
            paddingLeft: '11px',
            paddingY: 1,
            backgroundColor: theme.palette.custom.dataGrid.toolbar,
            borderTop: `1px solid rgba(255, 255, 255, 0.12)`,
            borderBottom: `1px solid ${theme.palette.custom.dataGrid.border}`,
          },

          [`& .${gridClasses.columnHeader}`]: {
            backgroundColor: theme.palette.custom.dataGrid.header,
            outlineOffset: -2,
            outline: 0,

            '&:focus-within': {
              outlineOffset: -2,
            },
          },

          [`& .${gridClasses.filler}`]: {
            backgroundColor: theme.palette.custom.dataGrid.header,
          },

          '& .mui-tgsonj': {
            backgroundColor: theme.palette.background.default,
          },

          [`& .${gridClasses.selectedRowCount}`]: {
            display: { xs: 'none', sm: 'flex' },
          },

          [`& .${gridClasses.footerContainer}`]: {
            backgroundColor: theme.palette.custom.dataGrid.toolbar,
            justifyContent: { xs: 'center', sm: 'space-between' },
          },
        }}
        {...dataGridProps}
      />
    </Box>
  );
}
