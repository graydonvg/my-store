'use client';

import { OrdersDataGrid, UpdateOrderSchema, QueryFilterDataGrid, QueryPageDataGrid, QuerySortDataGrid } from '@/types';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import CustomDataGrid from '../../dataGrid/CustomDataGrid';
import { Flip, toast } from 'react-toastify';
import { GridValidRowModel } from '@mui/x-data-grid';
import OrdersDataGridToolbar from './OrdersDataGridToolbar';
import { getChangedDataGridValue } from '@/utils/dataGridHelpers';
import { getObjectKeyCount } from '@/utils/objectHelpers';
import { updateOrder } from '@/services/admin/update';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import getOrdersDataGridColumns from './getOrdersDataGridColumns';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectUserData } from '@/lib/redux/features/user/userSelectors';
import { useLogger } from 'next-axiom';
import { LOGGER_ERROR_MESSAGES } from '@/constants';

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
  const log = useLogger();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const userData = useAppSelector(selectUserData);
  const columns = getOrdersDataGridColumns(isUpdating);
  const memoizedColumns = useMemo(() => columns, [columns]);

  async function handleRowUpdate(newRow: GridValidRowModel, oldRow: GridValidRowModel) {
    const validation = UpdateOrderSchema.safeParse(newRow);

    if (!validation.success) {
      log.warn(LOGGER_ERROR_MESSAGES.validation, {
        userId: userData?.userId,
        payload: newRow,
        error: validation.error,
      });

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

  function handleRowUpdateError(error: unknown) {
    log.error('Failed to update order', { error });

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
